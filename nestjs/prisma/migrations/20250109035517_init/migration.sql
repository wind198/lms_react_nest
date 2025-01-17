/*
  Warnings:

  - You are about to drop the column `date` on the `classsession` table. All the data in the column will be lost.
  - Changed the type of `start_time` on the `classsession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end_time` on the `classsession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `classsession` DROP COLUMN `date`,
    DROP COLUMN `start_time`,
    ADD COLUMN `start_time` DATETIME NOT NULL,
    DROP COLUMN `end_time`,
    ADD COLUMN `end_time` DATETIME NOT NULL;
