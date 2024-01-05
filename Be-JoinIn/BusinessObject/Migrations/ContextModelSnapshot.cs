﻿// <auto-generated />
using System;
using BusinessObject.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BusinessObject.Migrations
{
    [DbContext(typeof(Context))]
    partial class ContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("BusinessObject.Models.Application", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<DateTime?>("ConfirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("UserId");

                    b.ToTable("Applications");
                });

            modelBuilder.Entity("BusinessObject.Models.ApplicationMajor", b =>
                {
                    b.Property<Guid>("ApplicationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("MajorId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("ApplicationId", "MajorId");

                    b.HasIndex("MajorId");

                    b.ToTable("ApplicationMajors");
                });

            modelBuilder.Entity("BusinessObject.Models.AssignedTask", b =>
                {
                    b.Property<Guid>("AssignedById")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AssignedForId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("AssignedDate")
                        .HasColumnType("datetime2");

                    b.HasKey("AssignedById", "AssignedForId", "TaskId");

                    b.HasIndex("AssignedForId");

                    b.HasIndex("TaskId");

                    b.ToTable("AssignedTasks");
                });

            modelBuilder.Entity("BusinessObject.Models.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("TaskId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("BusinessObject.Models.Feedback", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("FeedbackedById")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("FeedbackedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("FeedbackedForId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("Rating")
                        .HasColumnType("real");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FeedbackedById");

                    b.HasIndex("FeedbackedForId");

                    b.ToTable("Feedbacks");
                });

            modelBuilder.Entity("BusinessObject.Models.Group", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("ClassName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("CurrentMilestoneId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("GroupSize")
                        .HasColumnType("int");

                    b.Property<int>("MemberCount")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SchoolName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Skill")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("SubjectName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CurrentMilestoneId")
                        .IsUnique()
                        .HasFilter("[CurrentMilestoneId] IS NOT NULL");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("BusinessObject.Models.GroupMajor", b =>
                {
                    b.Property<Guid>("GroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("MajorId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("MemberCount")
                        .HasColumnType("int");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("GroupId", "MajorId");

                    b.HasIndex("MajorId");

                    b.ToTable("GroupMajors");
                });

            modelBuilder.Entity("BusinessObject.Models.Major", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Majors");
                });

            modelBuilder.Entity("BusinessObject.Models.Member", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("JoinedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("LeftDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("UserId");

                    b.ToTable("Members");
                });

            modelBuilder.Entity("BusinessObject.Models.Milestone", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.ToTable("Milestones");
                });

            modelBuilder.Entity("BusinessObject.Models.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("BusinessObject.Models.Task", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("EndDateDeadline")
                        .HasColumnType("datetime2");

                    b.Property<int>("EstimatedDays")
                        .HasColumnType("int");

                    b.Property<DateTime?>("FinishedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("ImpotantLevel")
                        .HasColumnType("int");

                    b.Property<Guid?>("MainTaskId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("MemberId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartDateDeadline")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.HasIndex("GroupId");

                    b.HasIndex("MainTaskId");

                    b.HasIndex("MemberId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("BusinessObject.Models.Transaction", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("BusinessObject.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWSEQUENTIALID()");

                    b.Property<string>("Avatar")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("BirthDay")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Gender")
                        .HasColumnType("bit");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("bit");

                    b.Property<string>("OtherContact")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Skill")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Theme")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BusinessObject.Models.UserMajor", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("MajorId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "MajorId");

                    b.HasIndex("MajorId");

                    b.ToTable("UserMajors");
                });

            modelBuilder.Entity("BusinessObject.Models.Application", b =>
                {
                    b.HasOne("BusinessObject.Models.Group", "Group")
                        .WithMany("Applications")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.User", "User")
                        .WithMany("Applications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BusinessObject.Models.ApplicationMajor", b =>
                {
                    b.HasOne("BusinessObject.Models.Application", "Application")
                        .WithMany("ApplicationMajors")
                        .HasForeignKey("ApplicationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.Major", "Major")
                        .WithMany("ApplicationMajors")
                        .HasForeignKey("MajorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Application");

                    b.Navigation("Major");
                });

            modelBuilder.Entity("BusinessObject.Models.AssignedTask", b =>
                {
                    b.HasOne("BusinessObject.Models.Member", "AssignedBy")
                        .WithMany("AssignedTasksBy")
                        .HasForeignKey("AssignedById")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.Member", "AssignedFor")
                        .WithMany("AssignedTasksFor")
                        .HasForeignKey("AssignedForId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.Task", "Task")
                        .WithMany("AssignedTasks")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("AssignedBy");

                    b.Navigation("AssignedFor");

                    b.Navigation("Task");
                });

            modelBuilder.Entity("BusinessObject.Models.Comment", b =>
                {
                    b.HasOne("BusinessObject.Models.Task", null)
                        .WithMany("Comments")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("BusinessObject.Models.Feedback", b =>
                {
                    b.HasOne("BusinessObject.Models.User", "FeedbackedBy")
                        .WithMany("SentFeedbacks")
                        .HasForeignKey("FeedbackedById")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.User", "FeedbackedFor")
                        .WithMany("ReceivedFeedbacks")
                        .HasForeignKey("FeedbackedForId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("FeedbackedBy");

                    b.Navigation("FeedbackedFor");
                });

            modelBuilder.Entity("BusinessObject.Models.Group", b =>
                {
                    b.HasOne("BusinessObject.Models.Milestone", "CurrentMilestone")
                        .WithOne("GroupForCurrent")
                        .HasForeignKey("BusinessObject.Models.Group", "CurrentMilestoneId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("CurrentMilestone");
                });

            modelBuilder.Entity("BusinessObject.Models.GroupMajor", b =>
                {
                    b.HasOne("BusinessObject.Models.Group", "Group")
                        .WithMany("GroupMajors")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.Major", "Major")
                        .WithMany("GroupMajors")
                        .HasForeignKey("MajorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Major");
                });

            modelBuilder.Entity("BusinessObject.Models.Member", b =>
                {
                    b.HasOne("BusinessObject.Models.Group", "Group")
                        .WithMany("Members")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.User", "User")
                        .WithMany("Members")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BusinessObject.Models.Milestone", b =>
                {
                    b.HasOne("BusinessObject.Models.Group", "Group")
                        .WithMany("Milestones")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");
                });

            modelBuilder.Entity("BusinessObject.Models.Task", b =>
                {
                    b.HasOne("BusinessObject.Models.User", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.Group", "Group")
                        .WithMany("Tasks")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.Task", "MainTask")
                        .WithMany("SubTasks")
                        .HasForeignKey("MainTaskId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BusinessObject.Models.Member", null)
                        .WithMany("Tasks")
                        .HasForeignKey("MemberId");

                    b.Navigation("CreatedBy");

                    b.Navigation("Group");

                    b.Navigation("MainTask");
                });

            modelBuilder.Entity("BusinessObject.Models.Transaction", b =>
                {
                    b.HasOne("BusinessObject.Models.User", "User")
                        .WithMany("Transactions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BusinessObject.Models.UserMajor", b =>
                {
                    b.HasOne("BusinessObject.Models.Major", "Major")
                        .WithMany("UserMajors")
                        .HasForeignKey("MajorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BusinessObject.Models.User", "User")
                        .WithMany("UserMajors")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Major");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BusinessObject.Models.Application", b =>
                {
                    b.Navigation("ApplicationMajors");
                });

            modelBuilder.Entity("BusinessObject.Models.Group", b =>
                {
                    b.Navigation("Applications");

                    b.Navigation("GroupMajors");

                    b.Navigation("Members");

                    b.Navigation("Milestones");

                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("BusinessObject.Models.Major", b =>
                {
                    b.Navigation("ApplicationMajors");

                    b.Navigation("GroupMajors");

                    b.Navigation("UserMajors");
                });

            modelBuilder.Entity("BusinessObject.Models.Member", b =>
                {
                    b.Navigation("AssignedTasksBy");

                    b.Navigation("AssignedTasksFor");

                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("BusinessObject.Models.Milestone", b =>
                {
                    b.Navigation("GroupForCurrent")
                        .IsRequired();
                });

            modelBuilder.Entity("BusinessObject.Models.Task", b =>
                {
                    b.Navigation("AssignedTasks");

                    b.Navigation("Comments");

                    b.Navigation("SubTasks");
                });

            modelBuilder.Entity("BusinessObject.Models.User", b =>
                {
                    b.Navigation("Applications");

                    b.Navigation("Members");

                    b.Navigation("ReceivedFeedbacks");

                    b.Navigation("SentFeedbacks");

                    b.Navigation("Transactions");

                    b.Navigation("UserMajors");
                });
#pragma warning restore 612, 618
        }
    }
}