import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_referrers_status" AS ENUM('active', 'suspended');
  CREATE TYPE "public"."enum_referrals_status" AS ENUM('pending', 'qualified', 'rejected');
  CREATE TABLE "referrers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"code" varchar,
  	"status" "enum_referrers_status" DEFAULT 'active' NOT NULL,
  	"reward_override" numeric,
  	"clicks" numeric DEFAULT 0,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "referrals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"referrer_id" integer NOT NULL,
  	"contact_id" integer,
  	"status" "enum_referrals_status" DEFAULT 'pending' NOT NULL,
  	"reward_amount" numeric,
  	"paid_out" boolean DEFAULT false,
  	"landing_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "referral_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_reward" numeric DEFAULT 500 NOT NULL,
  	"currency" varchar DEFAULT 'USD' NOT NULL,
  	"cookie_days" numeric DEFAULT 30 NOT NULL,
  	"terms" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP INDEX "_posts_v_autosave_idx";
  ALTER TABLE "success_videos" ALTER COLUMN "thumbnail_id" DROP NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "referrers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "referrals_id" integer;
  ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_referrers_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."referrers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "referrals" ADD CONSTRAINT "referrals_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "referrers_email_idx" ON "referrers" USING btree ("email");
  CREATE UNIQUE INDEX "referrers_code_idx" ON "referrers" USING btree ("code");
  CREATE INDEX "referrers_updated_at_idx" ON "referrers" USING btree ("updated_at");
  CREATE INDEX "referrers_created_at_idx" ON "referrers" USING btree ("created_at");
  CREATE INDEX "referrals_referrer_idx" ON "referrals" USING btree ("referrer_id");
  CREATE INDEX "referrals_contact_idx" ON "referrals" USING btree ("contact_id");
  CREATE INDEX "referrals_updated_at_idx" ON "referrals" USING btree ("updated_at");
  CREATE INDEX "referrals_created_at_idx" ON "referrals" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_referrers_fk" FOREIGN KEY ("referrers_id") REFERENCES "public"."referrers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_referrals_fk" FOREIGN KEY ("referrals_id") REFERENCES "public"."referrals"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_referrers_id_idx" ON "payload_locked_documents_rels" USING btree ("referrers_id");
  CREATE INDEX "payload_locked_documents_rels_referrals_id_idx" ON "payload_locked_documents_rels" USING btree ("referrals_id");
  ALTER TABLE "_posts_v" DROP COLUMN "autosave";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "referrers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "referrals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "referral_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "referrers" CASCADE;
  DROP TABLE "referrals" CASCADE;
  DROP TABLE "referral_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_referrers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_referrals_fk";
  
  DROP INDEX "payload_locked_documents_rels_referrers_id_idx";
  DROP INDEX "payload_locked_documents_rels_referrals_id_idx";
  ALTER TABLE "success_videos" ALTER COLUMN "thumbnail_id" SET NOT NULL;
  ALTER TABLE "_posts_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "referrers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "referrals_id";
  DROP TYPE "public"."enum_referrers_status";
  DROP TYPE "public"."enum_referrals_status";`)
}
