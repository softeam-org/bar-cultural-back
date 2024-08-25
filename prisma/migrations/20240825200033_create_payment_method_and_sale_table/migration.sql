-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "payment_terminal_id" TEXT NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "sale_id" TEXT NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_payment_terminal_id_fkey" FOREIGN KEY ("payment_terminal_id") REFERENCES "payment-terminals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
