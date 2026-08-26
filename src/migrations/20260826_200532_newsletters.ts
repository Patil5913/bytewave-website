import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_newsletters_status" AS ENUM('draft', 'sent');
  CREATE TABLE "newsletters_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "newsletters_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"href" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "newsletters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar NOT NULL,
  	"preheader" varchar NOT NULL,
  	"edition" varchar,
  	"heading" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"signoff" varchar,
  	"status" "enum_newsletters_status" DEFAULT 'draft' NOT NULL,
  	"sent_at" timestamp(3) with time zone,
  	"sent_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletters_id" integer;
  ALTER TABLE "newsletters_stats" ADD CONSTRAINT "newsletters_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletters_items" ADD CONSTRAINT "newsletters_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletters_stats_order_idx" ON "newsletters_stats" USING btree ("_order");
  CREATE INDEX "newsletters_stats_parent_id_idx" ON "newsletters_stats" USING btree ("_parent_id");
  CREATE INDEX "newsletters_items_order_idx" ON "newsletters_items" USING btree ("_order");
  CREATE INDEX "newsletters_items_parent_id_idx" ON "newsletters_items" USING btree ("_parent_id");
  CREATE INDEX "newsletters_updated_at_idx" ON "newsletters" USING btree ("updated_at");
  CREATE INDEX "newsletters_created_at_idx" ON "newsletters" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_newsletters_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletters_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletters_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletters_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletters" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "newsletters_stats" CASCADE;
  DROP TABLE "newsletters_items" CASCADE;
  DROP TABLE "newsletters" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletters_fk";
  
  DROP INDEX "payload_locked_documents_rels_newsletters_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletters_id";
  DROP TYPE "public"."enum_newsletters_status";`)
}
