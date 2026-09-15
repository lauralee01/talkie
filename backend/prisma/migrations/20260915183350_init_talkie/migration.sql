-- CreateTable
CREATE TABLE "Talkie" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "recordingId" TEXT NOT NULL,
    "fromNumber" TEXT NOT NULL,
    "toNumber" TEXT NOT NULL,
    "durationSeconds" DOUBLE PRECISION NOT NULL,
    "fileFormat" TEXT NOT NULL,
    "audioPath" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Talkie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Talkie_recordingId_key" ON "Talkie"("recordingId");
