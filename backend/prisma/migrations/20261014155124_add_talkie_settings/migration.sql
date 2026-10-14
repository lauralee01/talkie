-- CreateTable
CREATE TABLE "TalkieSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "welcomePrompt" TEXT NOT NULL DEFAULT 'Welcome to Talkie. Press 1 to leave a message.',
    "recordPrompt" TEXT NOT NULL DEFAULT 'Leave your Talkie after the beep. Press pound when you are finished.',
    "invalidOptionPrompt" TEXT NOT NULL DEFAULT 'Sorry, that option is not available.',
    "goodbyePrompt" TEXT NOT NULL DEFAULT 'Your Talkie has been saved. Goodbye.',
    "maxRecordingSeconds" INTEGER NOT NULL DEFAULT 60,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TalkieSettings_pkey" PRIMARY KEY ("id")
);
