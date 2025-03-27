import { TransactionStatus } from "@/app/types/transactionStatus";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { UploadSS } from "@/components/UploadSS";
import {
  CheckCircledIcon,
  ClockIcon,
  CrossCircledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import { cn, stageDialogs } from "@/lib/utils";
import { StageType } from "@/app/types/stage";
import { TransactionType } from "@/app/types/transaction";
import { TransactionRejected } from "./TransactionRejected";
import { TransactionFinished } from "./TransactionFinished";
import { ImageView } from "./ImageView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TransactionAproved } from "./TransactionAproved";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DinamicCard } from "./DinamicCard";
import TransactionQRRejected from "./TransactionQRRejected";

export const TimelineStage = ({
  stage,
  stages,
  currentTransaction,
  qrRejectedUrl,
  handleUploadSS,
  handleAcceptRejection,
  handleAcceptBan,
  handleCorrectQR,
}: {
  stage: StageType;
  stages: StageType[];
  currentTransaction: TransactionType | null;
  qrRejectedUrl?: string;
  handleUploadSS?: (base64: string) => void;
  handleAcceptRejection?: () => void;
  handleAcceptBan?: () => void;
  handleCorrectQR?: (base64: string) => void;
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!currentTransaction) return null;

  const currentStage = statusToStage(currentTransaction.status);
  const isCurrentStage = currentStage === stage;

  const isCompleted =
    currentTransaction &&
    (currentStage === "finished" ||
      stages.indexOf(currentStage) > stages.indexOf(stage) ||
      (isCurrentStage && currentTransaction.status === "aproved") ||
      (currentTransaction.status === "aproved" &&
        currentTransaction.timestamps.qrRejectedAt &&
        stage === "qrRejected"));

  let name: string | undefined = "";
  let isRejected = false;

  if (currentTransaction?.status === "rejected" && stage === "result") {
    name = stageDialogs["rejected"]?.name;
    isRejected = true;
  } else if (currentTransaction?.status === "aproved" && stage === "result") {
    name = stageDialogs["aproved"]?.name;
  } else if (
    currentTransaction.status === "qrRejected" &&
    stage === "qrRejected"
  ) {
    name = stageDialogs["qrRejected"]?.name;
    isRejected = true;
  } else {
    name = stageDialogs[stage]?.name;
  }

  const onClickCard = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === "IMG") {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <TimelineItem>
      {!isMobile && (
        <TimelineOppositeContent>
          <p className={cn((isCompleted || isCurrentStage) && "font-semibold")}>
            {name}
          </p>
        </TimelineOppositeContent>
      )}
      <TimelineSeparator>
        <TimelineDot
          color={
            isRejected
              ? "error"
              : isCompleted
              ? "success"
              : isCurrentStage ||
                (currentTransaction?.status === "aproved" &&
                  stage === "finished")
              ? "info"
              : "grey"
          }
        >
          {isCurrentStage ? (
            currentTransaction?.status === "rejected" ||
            currentTransaction.status === "qrRejected" ? (
              <CrossCircledIcon />
            ) : currentTransaction?.status === "aproved" ||
              currentTransaction?.status === "finished" ? (
              <CheckCircledIcon />
            ) : (
              <ClockIcon />
            )
          ) : isCompleted ? (
            <CheckCircledIcon />
          ) : currentTransaction?.status === "aproved" &&
            stage === "finished" ? (
            <ClockIcon />
          ) : (
            <BookmarkIcon />
          )}
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {isMobile && (
          <p className={cn((isCompleted || isCurrentStage) && "font-semibold")}>
            {name}
          </p>
        )}
        {isCurrentStage ? (
          stage === "waitingSS" ? (
            handleUploadSS && <UploadSS handleUploadSS={handleUploadSS} />
          ) : stage === "checkingSS" ? (
            <div className="flex flex-col items-center">
              <p className="text-sm">{stageDialogs[stage]?.inProcess}</p>
            </div>
          ) : stage === "result" ||
            stage === "finished" ||
            stage === "qrRejected" ? (
            <div
              className={cn("flex flex-col w-full", !isMobile && "items-end")}
            >
              {currentTransaction.status === "aproved" ? (
                <Card className="w-full md:w-1/2 items-center p-4">
                  <TransactionAproved
                    message={stageDialogs[currentTransaction.status]?.done!}
                    clientSSImgUrl={currentTransaction.clientSSImgUrl!}
                  />
                </Card>
              ) : currentTransaction.status === "rejected" ? (
                <TransactionRejected
                  rejectReason={currentTransaction.rejectReason!}
                  imgUrl={currentTransaction.clientSSImgUrl}
                  onAcceptRejection={handleAcceptRejection}
                  onAcceptBan={handleAcceptBan}
                />
              ) : currentTransaction.status === "finished" ? (
                <div
                  className={cn(
                    "w-full flex flex-col gap-4",
                    stages.includes("qrRejected") ? "items-end" : "items-start"
                  )}
                >
                  <TransactionFinished
                    imgUrl={currentTransaction.responseSSImgUrl!}
                    message={stageDialogs[currentTransaction.status]?.done!}
                  />
                </div>
              ) : currentTransaction.status === "qrRejected" ? (
                <TransactionQRRejected
                  imgUrl={qrRejectedUrl}
                  onCorrectQR={handleCorrectQR}
                />
              ) : null}
            </div>
          ) : null
        ) : isCompleted ? (
          <div className="flex flex-col items-center">
            {currentTransaction?.status === "finished" && stage === "result" ? (
              //En este caso, la transacción ha sido aprobada pero aun no se realizo
              //el pago al cliente
              <DinamicCard message={stageDialogs["aproved"]?.done!}>
                <ImageView
                  src={currentTransaction.clientSSImgUrl!}
                  alt="Captura de pago"
                  smallProps={{
                    width: 200,
                    height: 200,
                    className: "cursor-zoom-in",
                  }}
                  largeProps={{
                    width: 400,
                    height: 400,
                  }}
                />
              </DinamicCard>
            ) : stage === "waitingSS" ? (
              <DinamicCard message={stageDialogs[stage]?.done!}>
                <ImageView
                  src={currentTransaction.clientSSImgUrl!}
                  alt="Captura de pago"
                  smallProps={{
                    width: 200,
                    height: 200,
                    className: "cursor-zoom-in",
                  }}
                  largeProps={{
                    width: 400,
                    height: 400,
                  }}
                />
              </DinamicCard>
            ) : (
              <p className="text-sm font-bold">{stageDialogs[stage]?.done}</p>
            )}
          </div>
        ) : currentTransaction?.status === "aproved" && stage === "finished" ? (
          <div className="flex flex-col items-center">
            {stageDialogs["finished"]?.inProcess}
          </div>
        ) : (
          <p className="text-sm"></p>
        )}
      </TimelineContent>
    </TimelineItem>
  );
};

const statusToStage = (status: TransactionStatus): StageType => {
  switch (status) {
    case "waitingSS":
      return "waitingSS";
    case "checkingSS":
      return "checkingSS";
    case "aproved":
      return "result";
    case "rejected":
      return "result";
    case "qrRejected":
      return "qrRejected";
    case "finished":
      return "finished";
  }
};
