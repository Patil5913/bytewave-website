import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_contacts_type" AS ENUM('talent', 'enterprise', 'lead', 'newsletter');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_placements_status" AS ENUM('Placed', 'Interviewing', 'Offer', 'Negotiating');
  CREATE TYPE "public"."enum_client_quotes_row" AS ENUM('one', 'two');
  CREATE TYPE "public"."enum_success_videos_row" AS ENUM('one', 'two');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_contacts_type" DEFAULT 'talent' NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"role" varchar,
  	"experience" varchar,
  	"company" varchar,
  	"headcount" varchar,
  	"stack" varchar,
  	"message" varchar,
  	"source" varchar,
  	"ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "company_faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "professional_faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"article_id" varchar,
  	"title" varchar,
  	"tag" varchar,
  	"published_at" timestamp(3) with time zone,
  	"date" varchar,
  	"updated" boolean DEFAULT false,
  	"read_time" varchar,
  	"cover_id" integer,
  	"excerpt" varchar,
  	"author" varchar,
  	"author_title" varchar,
  	"author_bio" varchar,
  	"author_linked_in" varchar,
  	"author_avatar_id" integer,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_article_id" varchar,
  	"version_title" varchar,
  	"version_tag" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_date" varchar,
  	"version_updated" boolean DEFAULT false,
  	"version_read_time" varchar,
  	"version_cover_id" integer,
  	"version_excerpt" varchar,
  	"version_author" varchar,
  	"version_author_title" varchar,
  	"version_author_bio" varchar,
  	"version_author_linked_in" varchar,
  	"version_author_avatar_id" integer,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "placements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"stack" varchar NOT NULL,
  	"candidate" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"pay" varchar NOT NULL,
  	"status" "enum_placements_status" DEFAULT 'Placed' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "client_quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar,
  	"company" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"row" "enum_client_quotes_row" DEFAULT 'one',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "success_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"company" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"duration" varchar,
  	"thumbnail_id" integer NOT NULL,
  	"row" "enum_success_videos_row" DEFAULT 'one',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"ref" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"logo_name" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"contacts_id" integer,
  	"company_faqs_id" integer,
  	"professional_faqs_id" integer,
  	"posts_id" integer,
  	"placements_id" integer,
  	"client_quotes_id" integer,
  	"success_videos_id" integer,
  	"certifications_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"decimals" numeric DEFAULT 0 NOT NULL,
  	"suffix" varchar DEFAULT '',
  	"label" varchar NOT NULL,
  	"note" varchar NOT NULL
  );
  
  CREATE TABLE "site_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_manifesto_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_agent_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_story_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"manifesto_headline" varchar,
  	"manifesto_body" varchar,
  	"cta_headline" varchar,
  	"cta_body" varchar,
  	"cta_response_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_footer_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"legal_line" varchar,
  	"address" varchar,
  	"nav_cta_label" varchar DEFAULT 'Get Started',
  	"region" varchar DEFAULT 'English (US)',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "track_record_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "track_record_growth" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "track_record" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_page_documents_clauses_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "legal_page_documents_clauses" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"n" varchar NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "legal_page_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ref" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL
  );
  
  CREATE TABLE "legal_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity" varchar,
  	"version" varchar,
  	"effective" varchar,
  	"governing_law" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faqs" ADD CONSTRAINT "posts_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_avatar_id_media_id_fk" FOREIGN KEY ("author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faqs" ADD CONSTRAINT "_posts_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_avatar_id_media_id_fk" FOREIGN KEY ("version_author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "success_videos" ADD CONSTRAINT "success_videos_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_company_faqs_fk" FOREIGN KEY ("company_faqs_id") REFERENCES "public"."company_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_professional_faqs_fk" FOREIGN KEY ("professional_faqs_id") REFERENCES "public"."professional_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_placements_fk" FOREIGN KEY ("placements_id") REFERENCES "public"."placements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_quotes_fk" FOREIGN KEY ("client_quotes_id") REFERENCES "public"."client_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_success_videos_fk" FOREIGN KEY ("success_videos_id") REFERENCES "public"."success_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_stats_stats" ADD CONSTRAINT "site_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_manifesto_points" ADD CONSTRAINT "homepage_manifesto_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_agent_paragraphs" ADD CONSTRAINT "homepage_agent_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_story_panels" ADD CONSTRAINT "homepage_story_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_groups_links" ADD CONSTRAINT "site_settings_footer_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_groups" ADD CONSTRAINT "site_settings_footer_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "track_record_stats" ADD CONSTRAINT "track_record_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "track_record_growth" ADD CONSTRAINT "track_record_growth_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."track_record"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_page_documents_clauses_paragraphs" ADD CONSTRAINT "legal_page_documents_clauses_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_page_documents_clauses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_page_documents_clauses" ADD CONSTRAINT "legal_page_documents_clauses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_page_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_page_documents" ADD CONSTRAINT "legal_page_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "contacts_ip_hash_idx" ON "contacts" USING btree ("ip_hash");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX "company_faqs_updated_at_idx" ON "company_faqs" USING btree ("updated_at");
  CREATE INDEX "company_faqs_created_at_idx" ON "company_faqs" USING btree ("created_at");
  CREATE INDEX "professional_faqs_updated_at_idx" ON "professional_faqs" USING btree ("updated_at");
  CREATE INDEX "professional_faqs_created_at_idx" ON "professional_faqs" USING btree ("created_at");
  CREATE INDEX "posts_faqs_order_idx" ON "posts_faqs" USING btree ("_order");
  CREATE INDEX "posts_faqs_parent_id_idx" ON "posts_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_article_id_idx" ON "posts" USING btree ("article_id");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_author_avatar_idx" ON "posts" USING btree ("author_avatar_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_version_faqs_order_idx" ON "_posts_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faqs_parent_id_idx" ON "_posts_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_article_id_idx" ON "_posts_v" USING btree ("version_article_id");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_author_avatar_idx" ON "_posts_v" USING btree ("version_author_avatar_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "placements_updated_at_idx" ON "placements" USING btree ("updated_at");
  CREATE INDEX "placements_created_at_idx" ON "placements" USING btree ("created_at");
  CREATE INDEX "client_quotes_updated_at_idx" ON "client_quotes" USING btree ("updated_at");
  CREATE INDEX "client_quotes_created_at_idx" ON "client_quotes" USING btree ("created_at");
  CREATE INDEX "success_videos_thumbnail_idx" ON "success_videos" USING btree ("thumbnail_id");
  CREATE INDEX "success_videos_updated_at_idx" ON "success_videos" USING btree ("updated_at");
  CREATE INDEX "success_videos_created_at_idx" ON "success_videos" USING btree ("created_at");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_locked_documents_rels_company_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("company_faqs_id");
  CREATE INDEX "payload_locked_documents_rels_professional_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("professional_faqs_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_placements_id_idx" ON "payload_locked_documents_rels" USING btree ("placements_id");
  CREATE INDEX "payload_locked_documents_rels_client_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("client_quotes_id");
  CREATE INDEX "payload_locked_documents_rels_success_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("success_videos_id");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_stats_stats_order_idx" ON "site_stats_stats" USING btree ("_order");
  CREATE INDEX "site_stats_stats_parent_id_idx" ON "site_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_manifesto_points_order_idx" ON "homepage_manifesto_points" USING btree ("_order");
  CREATE INDEX "homepage_manifesto_points_parent_id_idx" ON "homepage_manifesto_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_agent_paragraphs_order_idx" ON "homepage_agent_paragraphs" USING btree ("_order");
  CREATE INDEX "homepage_agent_paragraphs_parent_id_idx" ON "homepage_agent_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "homepage_story_panels_order_idx" ON "homepage_story_panels" USING btree ("_order");
  CREATE INDEX "homepage_story_panels_parent_id_idx" ON "homepage_story_panels" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_groups_links_order_idx" ON "site_settings_footer_groups_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_groups_links_parent_id_idx" ON "site_settings_footer_groups_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_groups_order_idx" ON "site_settings_footer_groups" USING btree ("_order");
  CREATE INDEX "site_settings_footer_groups_parent_id_idx" ON "site_settings_footer_groups" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");
  CREATE INDEX "track_record_stats_order_idx" ON "track_record_stats" USING btree ("_order");
  CREATE INDEX "track_record_stats_parent_id_idx" ON "track_record_stats" USING btree ("_parent_id");
  CREATE INDEX "track_record_growth_order_idx" ON "track_record_growth" USING btree ("_order");
  CREATE INDEX "track_record_growth_parent_id_idx" ON "track_record_growth" USING btree ("_parent_id");
  CREATE INDEX "legal_page_documents_clauses_paragraphs_order_idx" ON "legal_page_documents_clauses_paragraphs" USING btree ("_order");
  CREATE INDEX "legal_page_documents_clauses_paragraphs_parent_id_idx" ON "legal_page_documents_clauses_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "legal_page_documents_clauses_order_idx" ON "legal_page_documents_clauses" USING btree ("_order");
  CREATE INDEX "legal_page_documents_clauses_parent_id_idx" ON "legal_page_documents_clauses" USING btree ("_parent_id");
  CREATE INDEX "legal_page_documents_order_idx" ON "legal_page_documents" USING btree ("_order");
  CREATE INDEX "legal_page_documents_parent_id_idx" ON "legal_page_documents" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "company_faqs" CASCADE;
  DROP TABLE "professional_faqs" CASCADE;
  DROP TABLE "posts_faqs" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v_version_faqs" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "placements" CASCADE;
  DROP TABLE "client_quotes" CASCADE;
  DROP TABLE "success_videos" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_stats_stats" CASCADE;
  DROP TABLE "site_stats" CASCADE;
  DROP TABLE "homepage_manifesto_points" CASCADE;
  DROP TABLE "homepage_agent_paragraphs" CASCADE;
  DROP TABLE "homepage_story_panels" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "site_settings_footer_groups_links" CASCADE;
  DROP TABLE "site_settings_footer_groups" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "track_record_stats" CASCADE;
  DROP TABLE "track_record_growth" CASCADE;
  DROP TABLE "track_record" CASCADE;
  DROP TABLE "legal_page_documents_clauses_paragraphs" CASCADE;
  DROP TABLE "legal_page_documents_clauses" CASCADE;
  DROP TABLE "legal_page_documents" CASCADE;
  DROP TABLE "legal_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_contacts_type";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_placements_status";
  DROP TYPE "public"."enum_client_quotes_row";
  DROP TYPE "public"."enum_success_videos_row";`)
}
