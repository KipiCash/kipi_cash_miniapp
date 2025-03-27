"use client";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { TimelineStage } from "@/components/TimelineStage";
import { CheckCircledIcon, ClockIcon } from "@radix-ui/react-icons";
import { TransactionType } from "@/app/types/transaction";
import { StageType } from "@/app/types/stage";
import { UserInfo } from "@/components/UserInfo";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import { Button } from "@mui/material";

export const TransactionTimeline = ({
  stages,
  handleCancelRequest,
  currentTransaction,
  qrRejectedUrl,
  handleUploadSS,
  handleAcceptRejection,
  handleAcceptBan,
  handleCorrectQR,
}: {
  stages: StageType[];
  handleCancelRequest?: () => void;
  currentTransaction: TransactionType | null;
  qrRejectedUrl?: string;
  handleUploadSS?: (base64: string) => void;
  handleAcceptRejection?: () => void;
  handleAcceptBan?: () => void;
  handleCorrectQR?: (base64: string) => void;
}) => {
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Timeline
      position={isMobile ? "right" : "alternate"}
      sx={
        isMobile
          ? {
              [`& .${timelineItemClasses.root}`]: {
                "::before": {
                  content: "none",
                },
              },
            }
          : undefined
      }
    >
      <TimelineItem>
        {!isMobile && (
          <TimelineOppositeContent>
            <p className="font-semibold">Conectando con un Cambista</p>
          </TimelineOppositeContent>
        )}
        <TimelineSeparator>
          {currentTransaction ? (
            <TimelineDot color="success">
              <CheckCircledIcon />
            </TimelineDot>
          ) : (
            <TimelineDot color="info">
              <ClockIcon />
            </TimelineDot>
          )}
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <>
            {isMobile && (
              <p className="font-semibold">Conectando con un Cambista</p>
            )}
            {currentTransaction ? (
              <div className="flex flex-col items-start ">
                <UserInfo
                  userId={
                    session?.user.role === "client"
                      ? currentTransaction.workerId
                      : currentTransaction.request.clientId
                  }
                  transactionStatus={currentTransaction.status}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500">
                  Buscando a un experto disponible para atender tu cambio. Por
                  favor espera…
                </p>
                <Button
                  color="info"
                  variant="outlined"
                  onClick={handleCancelRequest}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </>
        </TimelineContent>
      </TimelineItem>

      {stages.map((stage, index) => (
        <TimelineStage
          key={index}
          stage={stage}
          stages={stages}
          qrRejectedUrl={qrRejectedUrl}
          currentTransaction={currentTransaction}
          handleUploadSS={handleUploadSS}
          handleAcceptRejection={handleAcceptRejection}
          handleAcceptBan={handleAcceptBan}
          handleCorrectQR={handleCorrectQR}
        />
      ))}
    </Timeline>
  );
};
