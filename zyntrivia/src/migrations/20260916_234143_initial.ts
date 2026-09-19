import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Payload doesn't create a non-public schema on an existing database (e.g. Supabase).
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "payload";`)
  await db.execute(sql`
   CREATE TYPE "payload"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_case_studies_feature_shots_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum_case_studies_cover_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum_case_studies_industry" AS ENUM('retail-distribution', 'healthcare', 'marketplaces', 'professional-services', 'saas', 'cross-industry');
  CREATE TYPE "payload"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__case_studies_v_version_feature_shots_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum__case_studies_v_version_cover_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum__case_studies_v_version_industry" AS ENUM('retail-distribution', 'healthcare', 'marketplaces', 'professional-services', 'saas', 'cross-industry');
  CREATE TYPE "payload"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_services_capabilities_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum_services_hero_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum_services_problem_visual" AS ENUM('email-row', 'ledger', 'workflow-node', 'kpi-tiles', 'filter-panel', 'slack-message', 'table', 'chart', 'agent-trace');
  CREATE TYPE "payload"."enum_faqs_category" AS ENUM('process', 'ownership', 'communication', 'payments', 'support');
  CREATE TYPE "payload"."enum_quote_requests_status" AS ENUM('new', 'contacted', 'call-booked', 'quoted', 'won', 'lost');
  CREATE TYPE "payload"."enum_quote_requests_project_type" AS ENUM('web-app', 'automation', 'internal-tool', 'ai-agent', 'not-sure');
  CREATE TYPE "payload"."enum_quote_requests_timeline" AS ENUM('asap', '1-3-months', 'exploring');
  CREATE TYPE "payload"."enum_quote_requests_stage" AS ENUM('idea', 'replace-tool', 'extend-product');
  CREATE TYPE "payload"."enum_quote_requests_source" AS ENUM('search', 'linkedin', 'referral', 'blog', 'other');
  CREATE TYPE "payload"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "payload"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "payload"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"series" varchar,
  	"author" varchar DEFAULT 'Zyntrivia team',
  	"reading_time" numeric,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer,
  	"case_studies_id" integer
  );
  
  CREATE TABLE "payload"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_series" varchar,
  	"version_author" varchar DEFAULT 'Zyntrivia team',
  	"version_reading_time" numeric,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer,
  	"case_studies_id" integer
  );
  
  CREATE TABLE "payload"."topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."case_studies_problem_diagram_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."case_studies_problem_diagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."case_studies_feature_shots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"media_id" integer,
  	"visual" "payload"."enum_case_studies_feature_shots_visual"
  );
  
  CREATE TABLE "payload"."case_studies_architecture_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."case_studies_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."case_studies_architecture_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "payload"."case_studies_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "payload"."case_studies_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "payload"."case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"problem_line" varchar,
  	"outcome_line" varchar,
  	"demo_url" varchar,
  	"repo_url" varchar,
  	"cover_media_id" integer,
  	"cover_poster_id" integer,
  	"cover_visual" "payload"."enum_case_studies_cover_visual",
  	"at_a_glance_problem" varchar,
  	"at_a_glance_solution" varchar,
  	"at_a_glance_result" varchar,
  	"problem" jsonb,
  	"architecture_svg_id" integer,
  	"slug" varchar,
  	"industry" "payload"."enum_case_studies_industry",
  	"timeline" varchar,
  	"show_on_home" boolean DEFAULT false,
  	"order" numeric DEFAULT 10,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_problem_diagram_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_problem_diagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_feature_shots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"media_id" integer,
  	"visual" "payload"."enum__case_studies_v_version_feature_shots_visual",
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_architecture_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"detail" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_architecture_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_problem_line" varchar,
  	"version_outcome_line" varchar,
  	"version_demo_url" varchar,
  	"version_repo_url" varchar,
  	"version_cover_media_id" integer,
  	"version_cover_poster_id" integer,
  	"version_cover_visual" "payload"."enum__case_studies_v_version_cover_visual",
  	"version_at_a_glance_problem" varchar,
  	"version_at_a_glance_solution" varchar,
  	"version_at_a_glance_result" varchar,
  	"version_problem" jsonb,
  	"version_architecture_svg_id" integer,
  	"version_slug" varchar,
  	"version_industry" "payload"."enum__case_studies_v_version_industry",
  	"version_timeline" varchar,
  	"version_show_on_home" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 10,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "payload"."services_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"visual" "payload"."enum_services_capabilities_visual" NOT NULL
  );
  
  CREATE TABLE "payload"."services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"outcome_line" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"hero_visual" "payload"."enum_services_hero_visual" NOT NULL,
  	"problem_headline" varchar NOT NULL,
  	"problem_body" varchar NOT NULL,
  	"problem_visual" "payload"."enum_services_problem_visual",
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 10,
  	"featured_on_home" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_canonical" varchar,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"faqs_id" integer,
  	"case_studies_id" integer
  );
  
  CREATE TABLE "payload"."faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" "payload"."enum_faqs_category" NOT NULL,
  	"show_on_home" boolean DEFAULT false,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "payload"."quote_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "payload"."enum_quote_requests_status" DEFAULT 'new' NOT NULL,
  	"project_type" "payload"."enum_quote_requests_project_type" NOT NULL,
  	"timeline" "payload"."enum_quote_requests_timeline" NOT NULL,
  	"stage" "payload"."enum_quote_requests_stage" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"description" varchar NOT NULL,
  	"source" "payload"."enum_quote_requests_source",
  	"notes" varchar,
  	"meta_utm_source" varchar,
  	"meta_utm_medium" varchar,
  	"meta_utm_campaign" varchar,
  	"meta_landing_page" varchar,
  	"meta_referrer" varchar,
  	"meta_country" varchar,
  	"meta_user_agent_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."rate_limit_hits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"bucket" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "payload"."enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "payload"."enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload"."payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "payload"."enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"topics_id" integer,
  	"case_studies_id" integer,
  	"services_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"quote_requests_id" integer,
  	"rate_limit_hits_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline" varchar DEFAULT 'Software that takes the busywork off your team.' NOT NULL,
  	"hero_subhead" varchar DEFAULT 'We build custom web apps, internal tools, and AI automations for growing businesses in the US and Europe.' NOT NULL,
  	"before_after_before" varchar DEFAULT 'Five tabs, two inboxes, and someone copying numbers at 6pm.' NOT NULL,
  	"before_after_after" varchar DEFAULT 'One screen that updates itself.' NOT NULL,
  	"final_cta_headline" varchar DEFAULT 'Tell us what’s slowing your team down.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar DEFAULT 'hello@zyntrivia.com' NOT NULL,
  	"response_time" varchar DEFAULT 'Replies within one business day',
  	"location" varchar,
  	"social_linkedin_url" varchar,
  	"social_github_url" varchar,
  	"social_github_username" varchar,
  	"review_platform" varchar,
  	"review_rating" numeric,
  	"review_count" numeric,
  	"review_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "payload"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."posts_rels" ADD CONSTRAINT "posts_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "payload"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_problem_diagram_nodes" ADD CONSTRAINT "case_studies_problem_diagram_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies_problem_diagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_problem_diagram" ADD CONSTRAINT "case_studies_problem_diagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_feature_shots" ADD CONSTRAINT "case_studies_feature_shots_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_feature_shots" ADD CONSTRAINT "case_studies_feature_shots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_architecture_nodes" ADD CONSTRAINT "case_studies_architecture_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_architecture" ADD CONSTRAINT "case_studies_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_architecture_notes" ADD CONSTRAINT "case_studies_architecture_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_results" ADD CONSTRAINT "case_studies_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_stack" ADD CONSTRAINT "case_studies_stack_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_stack" ADD CONSTRAINT "case_studies_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies" ADD CONSTRAINT "case_studies_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."case_studies" ADD CONSTRAINT "case_studies_cover_poster_id_media_id_fk" FOREIGN KEY ("cover_poster_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."case_studies" ADD CONSTRAINT "case_studies_architecture_svg_id_media_id_fk" FOREIGN KEY ("architecture_svg_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."case_studies_rels" ADD CONSTRAINT "case_studies_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_problem_diagram_nodes" ADD CONSTRAINT "_case_studies_v_version_problem_diagram_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v_version_problem_diagram"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_problem_diagram" ADD CONSTRAINT "_case_studies_v_version_problem_diagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_feature_shots" ADD CONSTRAINT "_case_studies_v_version_feature_shots_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_feature_shots" ADD CONSTRAINT "_case_studies_v_version_feature_shots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_architecture_nodes" ADD CONSTRAINT "_case_studies_v_version_architecture_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v_version_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_architecture" ADD CONSTRAINT "_case_studies_v_version_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_architecture_notes" ADD CONSTRAINT "_case_studies_v_version_architecture_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_results" ADD CONSTRAINT "_case_studies_v_version_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_stack" ADD CONSTRAINT "_case_studies_v_version_stack_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_version_stack" ADD CONSTRAINT "_case_studies_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_media_id_media_id_fk" FOREIGN KEY ("version_cover_media_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_poster_id_media_id_fk" FOREIGN KEY ("version_cover_poster_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_architecture_svg_id_media_id_fk" FOREIGN KEY ("version_architecture_svg_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services_capabilities" ADD CONSTRAINT "services_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services_rels" ADD CONSTRAINT "services_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "payload"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."services_rels" ADD CONSTRAINT "services_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "payload"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "payload"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "payload"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "payload"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_limit_hits_fk" FOREIGN KEY ("rate_limit_hits_id") REFERENCES "payload"."rate_limit_hits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_rels" ADD CONSTRAINT "homepage_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_cover_image_idx" ON "payload"."posts" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "payload"."posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "payload"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "payload"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "payload"."posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "payload"."posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "payload"."posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "payload"."posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_topics_id_idx" ON "payload"."posts_rels" USING btree ("topics_id");
  CREATE INDEX "posts_rels_case_studies_id_idx" ON "payload"."posts_rels" USING btree ("case_studies_id");
  CREATE INDEX "_posts_v_parent_idx" ON "payload"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_image_idx" ON "payload"."_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "payload"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "payload"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "payload"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "payload"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "payload"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "payload"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "payload"."_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "payload"."_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "payload"."_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "payload"."_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "payload"."_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_topics_id_idx" ON "payload"."_posts_v_rels" USING btree ("topics_id");
  CREATE INDEX "_posts_v_rels_case_studies_id_idx" ON "payload"."_posts_v_rels" USING btree ("case_studies_id");
  CREATE UNIQUE INDEX "topics_slug_idx" ON "payload"."topics" USING btree ("slug");
  CREATE INDEX "topics_updated_at_idx" ON "payload"."topics" USING btree ("updated_at");
  CREATE INDEX "topics_created_at_idx" ON "payload"."topics" USING btree ("created_at");
  CREATE INDEX "case_studies_problem_diagram_nodes_order_idx" ON "payload"."case_studies_problem_diagram_nodes" USING btree ("_order");
  CREATE INDEX "case_studies_problem_diagram_nodes_parent_id_idx" ON "payload"."case_studies_problem_diagram_nodes" USING btree ("_parent_id");
  CREATE INDEX "case_studies_problem_diagram_order_idx" ON "payload"."case_studies_problem_diagram" USING btree ("_order");
  CREATE INDEX "case_studies_problem_diagram_parent_id_idx" ON "payload"."case_studies_problem_diagram" USING btree ("_parent_id");
  CREATE INDEX "case_studies_feature_shots_order_idx" ON "payload"."case_studies_feature_shots" USING btree ("_order");
  CREATE INDEX "case_studies_feature_shots_parent_id_idx" ON "payload"."case_studies_feature_shots" USING btree ("_parent_id");
  CREATE INDEX "case_studies_feature_shots_media_idx" ON "payload"."case_studies_feature_shots" USING btree ("media_id");
  CREATE INDEX "case_studies_architecture_nodes_order_idx" ON "payload"."case_studies_architecture_nodes" USING btree ("_order");
  CREATE INDEX "case_studies_architecture_nodes_parent_id_idx" ON "payload"."case_studies_architecture_nodes" USING btree ("_parent_id");
  CREATE INDEX "case_studies_architecture_order_idx" ON "payload"."case_studies_architecture" USING btree ("_order");
  CREATE INDEX "case_studies_architecture_parent_id_idx" ON "payload"."case_studies_architecture" USING btree ("_parent_id");
  CREATE INDEX "case_studies_architecture_notes_order_idx" ON "payload"."case_studies_architecture_notes" USING btree ("_order");
  CREATE INDEX "case_studies_architecture_notes_parent_id_idx" ON "payload"."case_studies_architecture_notes" USING btree ("_parent_id");
  CREATE INDEX "case_studies_results_order_idx" ON "payload"."case_studies_results" USING btree ("_order");
  CREATE INDEX "case_studies_results_parent_id_idx" ON "payload"."case_studies_results" USING btree ("_parent_id");
  CREATE INDEX "case_studies_stack_order_idx" ON "payload"."case_studies_stack" USING btree ("_order");
  CREATE INDEX "case_studies_stack_parent_id_idx" ON "payload"."case_studies_stack" USING btree ("_parent_id");
  CREATE INDEX "case_studies_stack_logo_idx" ON "payload"."case_studies_stack" USING btree ("logo_id");
  CREATE INDEX "case_studies_cover_media_idx" ON "payload"."case_studies" USING btree ("cover_media_id");
  CREATE INDEX "case_studies_cover_poster_idx" ON "payload"."case_studies" USING btree ("cover_poster_id");
  CREATE INDEX "case_studies_architecture_svg_idx" ON "payload"."case_studies" USING btree ("architecture_svg_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "payload"."case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_updated_at_idx" ON "payload"."case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "payload"."case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "payload"."case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_rels_order_idx" ON "payload"."case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "payload"."case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "payload"."case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_services_id_idx" ON "payload"."case_studies_rels" USING btree ("services_id");
  CREATE INDEX "_case_studies_v_version_problem_diagram_nodes_order_idx" ON "payload"."_case_studies_v_version_problem_diagram_nodes" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_problem_diagram_nodes_parent_id_idx" ON "payload"."_case_studies_v_version_problem_diagram_nodes" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_problem_diagram_order_idx" ON "payload"."_case_studies_v_version_problem_diagram" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_problem_diagram_parent_id_idx" ON "payload"."_case_studies_v_version_problem_diagram" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_feature_shots_order_idx" ON "payload"."_case_studies_v_version_feature_shots" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_feature_shots_parent_id_idx" ON "payload"."_case_studies_v_version_feature_shots" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_feature_shots_media_idx" ON "payload"."_case_studies_v_version_feature_shots" USING btree ("media_id");
  CREATE INDEX "_case_studies_v_version_architecture_nodes_order_idx" ON "payload"."_case_studies_v_version_architecture_nodes" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_architecture_nodes_parent_id_idx" ON "payload"."_case_studies_v_version_architecture_nodes" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_architecture_order_idx" ON "payload"."_case_studies_v_version_architecture" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_architecture_parent_id_idx" ON "payload"."_case_studies_v_version_architecture" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_architecture_notes_order_idx" ON "payload"."_case_studies_v_version_architecture_notes" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_architecture_notes_parent_id_idx" ON "payload"."_case_studies_v_version_architecture_notes" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_results_order_idx" ON "payload"."_case_studies_v_version_results" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_results_parent_id_idx" ON "payload"."_case_studies_v_version_results" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_stack_order_idx" ON "payload"."_case_studies_v_version_stack" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_stack_parent_id_idx" ON "payload"."_case_studies_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_stack_logo_idx" ON "payload"."_case_studies_v_version_stack" USING btree ("logo_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "payload"."_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_cover_media_idx" ON "payload"."_case_studies_v" USING btree ("version_cover_media_id");
  CREATE INDEX "_case_studies_v_version_version_cover_poster_idx" ON "payload"."_case_studies_v" USING btree ("version_cover_poster_id");
  CREATE INDEX "_case_studies_v_version_version_architecture_svg_idx" ON "payload"."_case_studies_v" USING btree ("version_architecture_svg_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "payload"."_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "payload"."_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "payload"."_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "payload"."_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "payload"."_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "payload"."_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "payload"."_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_autosave_idx" ON "payload"."_case_studies_v" USING btree ("autosave");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "payload"."_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "payload"."_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "payload"."_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_services_id_idx" ON "payload"."_case_studies_v_rels" USING btree ("services_id");
  CREATE INDEX "services_capabilities_order_idx" ON "payload"."services_capabilities" USING btree ("_order");
  CREATE INDEX "services_capabilities_parent_id_idx" ON "payload"."services_capabilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "payload"."services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "payload"."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "payload"."services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "payload"."services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "payload"."services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "payload"."services_rels" USING btree ("path");
  CREATE INDEX "services_rels_faqs_id_idx" ON "payload"."services_rels" USING btree ("faqs_id");
  CREATE INDEX "services_rels_case_studies_id_idx" ON "payload"."services_rels" USING btree ("case_studies_id");
  CREATE INDEX "faqs_updated_at_idx" ON "payload"."faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "payload"."faqs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "quote_requests_updated_at_idx" ON "payload"."quote_requests" USING btree ("updated_at");
  CREATE INDEX "quote_requests_created_at_idx" ON "payload"."quote_requests" USING btree ("created_at");
  CREATE INDEX "rate_limit_hits_key_idx" ON "payload"."rate_limit_hits" USING btree ("key");
  CREATE INDEX "rate_limit_hits_bucket_idx" ON "payload"."rate_limit_hits" USING btree ("bucket");
  CREATE INDEX "rate_limit_hits_updated_at_idx" ON "payload"."rate_limit_hits" USING btree ("updated_at");
  CREATE INDEX "rate_limit_hits_created_at_idx" ON "payload"."rate_limit_hits" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload"."payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload"."payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload"."payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload"."payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload"."payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload"."payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload"."payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload"."payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload"."payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload"."payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload"."payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_topics_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("topics_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_quote_requests_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("quote_requests_id");
  CREATE INDEX "payload_locked_documents_rels_rate_limit_hits_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("rate_limit_hits_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_rels_order_idx" ON "payload"."homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "payload"."homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "payload"."homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_case_studies_id_idx" ON "payload"."homepage_rels" USING btree ("case_studies_id");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "payload"."homepage_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."posts" CASCADE;
  DROP TABLE "payload"."posts_rels" CASCADE;
  DROP TABLE "payload"."_posts_v" CASCADE;
  DROP TABLE "payload"."_posts_v_rels" CASCADE;
  DROP TABLE "payload"."topics" CASCADE;
  DROP TABLE "payload"."case_studies_problem_diagram_nodes" CASCADE;
  DROP TABLE "payload"."case_studies_problem_diagram" CASCADE;
  DROP TABLE "payload"."case_studies_feature_shots" CASCADE;
  DROP TABLE "payload"."case_studies_architecture_nodes" CASCADE;
  DROP TABLE "payload"."case_studies_architecture" CASCADE;
  DROP TABLE "payload"."case_studies_architecture_notes" CASCADE;
  DROP TABLE "payload"."case_studies_results" CASCADE;
  DROP TABLE "payload"."case_studies_stack" CASCADE;
  DROP TABLE "payload"."case_studies" CASCADE;
  DROP TABLE "payload"."case_studies_rels" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_problem_diagram_nodes" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_problem_diagram" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_feature_shots" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_architecture_nodes" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_architecture" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_architecture_notes" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_results" CASCADE;
  DROP TABLE "payload"."_case_studies_v_version_stack" CASCADE;
  DROP TABLE "payload"."_case_studies_v" CASCADE;
  DROP TABLE "payload"."_case_studies_v_rels" CASCADE;
  DROP TABLE "payload"."services_capabilities" CASCADE;
  DROP TABLE "payload"."services" CASCADE;
  DROP TABLE "payload"."services_rels" CASCADE;
  DROP TABLE "payload"."faqs" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."quote_requests" CASCADE;
  DROP TABLE "payload"."rate_limit_hits" CASCADE;
  DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_jobs_log" CASCADE;
  DROP TABLE "payload"."payload_jobs" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."homepage" CASCADE;
  DROP TABLE "payload"."homepage_rels" CASCADE;
  DROP TABLE "payload"."site_settings" CASCADE;
  DROP TYPE "payload"."enum_posts_status";
  DROP TYPE "payload"."enum__posts_v_version_status";
  DROP TYPE "payload"."enum_case_studies_feature_shots_visual";
  DROP TYPE "payload"."enum_case_studies_cover_visual";
  DROP TYPE "payload"."enum_case_studies_industry";
  DROP TYPE "payload"."enum_case_studies_status";
  DROP TYPE "payload"."enum__case_studies_v_version_feature_shots_visual";
  DROP TYPE "payload"."enum__case_studies_v_version_cover_visual";
  DROP TYPE "payload"."enum__case_studies_v_version_industry";
  DROP TYPE "payload"."enum__case_studies_v_version_status";
  DROP TYPE "payload"."enum_services_capabilities_visual";
  DROP TYPE "payload"."enum_services_hero_visual";
  DROP TYPE "payload"."enum_services_problem_visual";
  DROP TYPE "payload"."enum_faqs_category";
  DROP TYPE "payload"."enum_quote_requests_status";
  DROP TYPE "payload"."enum_quote_requests_project_type";
  DROP TYPE "payload"."enum_quote_requests_timeline";
  DROP TYPE "payload"."enum_quote_requests_stage";
  DROP TYPE "payload"."enum_quote_requests_source";
  DROP TYPE "payload"."enum_payload_jobs_log_task_slug";
  DROP TYPE "payload"."enum_payload_jobs_log_state";
  DROP TYPE "payload"."enum_payload_jobs_task_slug";`)
}
