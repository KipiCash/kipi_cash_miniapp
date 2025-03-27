"use client";
import { useEffect, useState } from "react";

import { ButtonAnimated } from "@/components/ButtonAnimated";
import { TransactionTimeline } from "@/components/TransactionTimeLine";
import { Noice } from "@/components/Noice";

import { NoiceType } from "@/app/types/noice";
import { StageType } from "@/app/types/stage";
import { RequestType } from "@/app/types/request";
import { TransactionType } from "@/app/types/transaction";

import { stageDialogs } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  dataToTransactionDB,
  getCurrentTransactionByClient,
  transactionDBtoFront,
  updateTransaction,
} from "@/db/transaction";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { deleteRequest, getCurrentRequest, setRequest } from "@/db/request";
import { PartialTransaction } from "@/db/types";
import { useRouter } from "next/navigation";
import CountDown from "@/components/CountDown";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getConfig } from "@/db/config";
import COLLECTIONS from "@/db/collections";
import { updateUser } from "@/db/users";

export default function Page() {
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Cargando sus operaciones...",
  });

  const { data: session } = useSession();

  const [stages, setStages] = useState<StageType[]>([]);
  const [currentRequest, setCurrentRequest] = useState<RequestType | null>(
    null
  );
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionType | null>(null);
  const [upcommingTransaction, setUpcommingTransaction] =
    useState<TransactionType | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCurrentRequest = async () => {
      return await getCurrentRequest(session?.user.id!);
    };

    const fetchCurrentTransaction = async () => {
      return await getCurrentTransactionByClient(session?.user.id!);
    };

    const init = async () => {
      try {
        const _currentRequest = await fetchCurrentRequest();
        const _currentTransaction = await fetchCurrentTransaction();
        setCurrentRequest(_currentRequest);
        setCurrentTransaction(_currentTransaction);
        setNoice(null);
      } catch(error) {
        console.error(error);
        setNoice({
          type: "error",
          message: "No se pudo obtener la información de sus operaciones.",
          styleType: "page",
        });
      }
    };

    init();
  }, []);

  useEffect(() => {
    const transactionsQuery = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where("clientId", "==", session?.user.id)
    );
    const unsub = onSnapshot(transactionsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const transaction = await transactionDBtoFront(
            dataToTransactionDB(change.doc.data(), change.doc.id)
          );
          if (transaction.status === "waitingSS") {
            setCurrentRequest({
              ...currentRequest!,
              status: "taken",
            });
            if (currentTransaction) {
              setUpcommingTransaction(transaction);
            } else {
              setCurrentTransaction(transaction);
            }
          }
        } else if (change.type === "modified") {
          const transaction = await transactionDBtoFront(
            dataToTransactionDB(change.doc.data(), change.doc.id)
          );
          if (transaction.status == "aproved" || "rejected" || "finished") {
            setCurrentTransaction(transaction);
          }
        }
      });
    });
    return () => unsub();
  }, [currentTransaction]);

  useEffect(() => {
    const notify = () => {
      const url = "api/del";
      const data = JSON.stringify({ requestId: currentRequest?.id });
      navigator.sendBeacon(url, data);
    };

    if (currentRequest?.status === "taken") {
      return;
    } else if (currentRequest?.status === "pending") {
      window.addEventListener("beforeunload", notify);
    }

    return () => {
      window.removeEventListener("beforeunload", notify);
    };
  });

  const addRequest = async () => {
    setNoice({
      type: "loading",
      message: "Creando su solicitud...",
      styleType: "modal",
    });

    try {
      const createdAt = new Date();
      const currentRequest: RequestType = {
        id: crypto.randomUUID(),
        clientEmail: session?.user.email!,
        clientImage: session?.user.image!,
        clientId: session?.user.id!,
        clientName: session?.user.name!,
        createdAt: createdAt,
        status: "pending",
      };
      await Promise.all([setRequest(currentRequest)]);
      setCurrentRequest(currentRequest);
      setNoice(null);
    } catch (error) {
      setNoice({
        type: "error",
        message: "No se pudo crear su solicitud.",
        styleType: "modal",
      });
      console.error(error);
    }
  };

  const handleCancelRequest = async () => {
    await deleteRequest(currentRequest!.id);
    setCurrentRequest(null);
  };

  const handleUploadSS = async (base64: string) => {
    if (!currentTransaction) return;

    const storageRef = ref(
      storage,
      `kipi-cash/ss/${currentTransaction.id}-client-ss.png`
    );
    await uploadString(storageRef, base64, "data_url");
    const ssImgUrl = await getDownloadURL(storageRef);
    const ssSendAt = new Date();
    const partialUpdateTransaction: PartialTransaction = {
      id: currentTransaction.id,
      clientSSImgUrl: ssImgUrl,
      status: "checkingSS",
      timestamps: {
        ...currentTransaction.timestamps,
        ssSendAt,
      },
    };

    updateTransaction(partialUpdateTransaction);
    setCurrentTransaction({
      ...currentTransaction,
      ...partialUpdateTransaction,
    });
  };

  const handleAcceptRejection = async () => {
    setNoice({
      type: "loading",
      styleType: "modal",
      message: "Obteniendo su nueva transacción...",
    });
    setCurrentTransaction(upcommingTransaction);
    setNoice(null);
  };

  useEffect(() => {
    if (
      currentTransaction?.status === "rejected" ||
      currentTransaction?.status === "qrRejected"
    ) {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) =>
            stage !== "finished" && stage !== "aproved" && stage !== "rejected"
        )
      );
    } else if (currentTransaction?.timestamps.qrRejectedAt) {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) => stage !== "aproved" && stage !== "rejected"
        )
      );
    } else {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) =>
            stage !== "aproved" &&
            stage !== "rejected" &&
            stage !== "qrRejected"
        )
      );
    }
  }, [currentTransaction, currentRequest]);

  const handleCorrectQR = async (base64: string) => {
    try {
      if (!currentTransaction || !session?.user.id || !session.user.role)
        throw new Error("Datos faltantes");

      setNoice({
        type: "loading",
        message: "Actualizando QR...",
        styleType: "modal",
      });

      const storageRef = ref(storage, `kipi-cash/qr/${session.user.id}-qr.png`);
      await uploadString(storageRef, base64, "data_url");
      const qrImgUrl = await getDownloadURL(storageRef);

      await updateUser({
        userId: session.user.id,
        role: session.user.role,
        qrImgUrl,
      });

      const partialUpdateTransaction: PartialTransaction = {
        id: currentTransaction.id,
        status: "aproved",
      };
      await updateTransaction(partialUpdateTransaction);

      setNoice({
        type: "success",
        message: "QR actualizado correctamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setCurrentTransaction({
            ...currentTransaction,
            ...partialUpdateTransaction,
          });
          setNoice(null);
          resolve();
        }, 2000);
      });
    } catch (error) {
      setNoice({
        type: "error",
        message: "No se pudo actualizar el QR.",
        styleType: "modal",
      });
      console.error(error);
    }
  };

  const handleAcceptBan = () => {
    setCurrentTransaction(null);
    setCurrentRequest(null);

    window.location.reload();
  };

  const handleFinishTransaction = async () => {
    setCurrentRequest(null);
    setCurrentTransaction(null);
    setNoice({
      type: "success",
      message: "Transacción finalizada!",
      styleType: "modal",
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setNoice(null);
        router.replace(`/${session?.user?.role}`);
        resolve();
      }, 2000);
    });
  };

  const openTutorial = async () => {
    const config = await getConfig();
    if (config.tutorialUrl) {
      window.open(config.tutorialUrl, "_blank");
    } else {
      setNoice({
        type: "error",
        message: "No se ha configurado un tutorial.",
        styleType: "page",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center leading-none tracking-tight mt-5">
      {noice && <Noice noice={noice} />}
      {!currentRequest && !currentTransaction ? (
        <>
          {session?.user.banUntil &&
          new Date(session?.user.banUntil) > new Date() ? (
            <CountDown banUntil={session?.user.banUntil} />
          ) : (
            <>
              <p className="mb-4 text-3xl md:text-4xl lg:text-5xl">
                Hola,{" "}
                <span className="font-extrabold text-blue-600 dark:text-blue-500">
                  {session?.user.name}
                </span>
              </p>
              <h1 className="mb-4 text-4xl leading-none tracking-tight text-gray-800 md:text-5xl lg:text-6xl dark:text-white text-center">
                Bienvenido a{" "}
                <span className="font-extrabold text-blue-600 dark:text-blue-500">
                  KipiCash
                </span>{" "}
              </h1>
              <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                ¿Buscas un cambio?
              </p>
              <div className="flex flex-col items-center justify-center w-full lg:w-3/4 mx-auto px-4">
                <ButtonAnimated
                  text="Ver Tutorial"
                  variant="default"
                  className="w-1/4 my-2"
                  onClick={openTutorial}
                />
                <ButtonAnimated
                  text="Solicitar cambio"
                  variant="default"
                  className="w-1/4 my-2 bg-white text-gray-800 hover:bg-gray-100"
                  onClick={addRequest}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full">
          <TransactionTimeline
            stages={stages}
            handleCancelRequest={handleCancelRequest}
            currentTransaction={currentTransaction}
            qrRejectedUrl={session?.user.qrImgUrl}
            handleUploadSS={handleUploadSS}
            handleAcceptRejection={handleAcceptRejection}
            handleAcceptBan={handleAcceptBan}
            handleCorrectQR={handleCorrectQR}
          />
          {currentTransaction?.status === "finished" && (
            <div className="w-full flex flex-col items-center gap-4 my-4">
              <div className="w-1/2 md:w-1/4">
                <ButtonAnimated
                  variant="default"
                  text="Finalizar"
                  onClick={handleFinishTransaction}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
