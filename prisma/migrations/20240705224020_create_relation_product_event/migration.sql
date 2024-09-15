-- CreateTable
CREATE TABLE "products_events" (
    "product_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "products_events_pkey" PRIMARY KEY ("product_id","event_id")
);

-- AddForeignKey
ALTER TABLE "products_events" ADD CONSTRAINT "products_events_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_events" ADD CONSTRAINT "products_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
