-- CreateEnum
CREATE TYPE "public"."WebsiteStatus" AS ENUM ('Up', 'Down', 'Unknown');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Website" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timeAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebsiteTick" (
    "id" TEXT NOT NULL,
    "responce_time_ms" INTEGER NOT NULL,
    "status" "public"."WebsiteStatus" NOT NULL,
    "website_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteTick_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Website" ADD CONSTRAINT "Website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
