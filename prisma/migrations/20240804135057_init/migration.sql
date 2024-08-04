-- CreateTable
CREATE TABLE "Clothes" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Clothes_pkey" PRIMARY KEY ("id")
);
