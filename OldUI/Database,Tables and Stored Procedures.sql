USE [master]
GO
/****** Object:  Database [TRUserManagement]    Script Date: 15/06/2016 23:05:57 ******/
CREATE DATABASE [TRUserManagement]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'TRUserManagement', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\TRUserManagement.mdf' , SIZE = 14336KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'TRUserManagement_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\TRUserManagement_log.ldf' , SIZE = 92864KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [TRUserManagement] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [TRUserManagement].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [TRUserManagement] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [TRUserManagement] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [TRUserManagement] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [TRUserManagement] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [TRUserManagement] SET ARITHABORT OFF 
GO
ALTER DATABASE [TRUserManagement] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [TRUserManagement] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [TRUserManagement] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [TRUserManagement] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [TRUserManagement] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [TRUserManagement] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [TRUserManagement] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [TRUserManagement] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [TRUserManagement] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [TRUserManagement] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [TRUserManagement] SET  DISABLE_BROKER 
GO
ALTER DATABASE [TRUserManagement] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [TRUserManagement] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [TRUserManagement] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [TRUserManagement] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [TRUserManagement] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [TRUserManagement] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [TRUserManagement] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [TRUserManagement] SET RECOVERY FULL 
GO
ALTER DATABASE [TRUserManagement] SET  MULTI_USER 
GO
ALTER DATABASE [TRUserManagement] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [TRUserManagement] SET DB_CHAINING OFF 
GO
ALTER DATABASE [TRUserManagement] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [TRUserManagement] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
EXEC sys.sp_db_vardecimal_storage_format N'TRUserManagement', N'ON'
GO
USE [TRUserManagement]
GO
/****** Object:  User [CUDJOE-DEV\dev]    Script Date: 15/06/2016 23:05:57 ******/
CREATE USER [CUDJOE-DEV\dev] FOR LOGIN [CUDJOE-DEV\dev] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Schema [membership]    Script Date: 15/06/2016 23:05:57 ******/
CREATE SCHEMA [membership]
GO
/****** Object:  Schema [traderiser]    Script Date: 15/06/2016 23:05:57 ******/
CREATE SCHEMA [traderiser]
GO
/****** Object:  StoredProcedure [dbo].[proc_CheckSubscriptionQuery]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[proc_CheckSubscriptionQuery]
@Query nvarchar(MAX),
@Username nvarchar(MAX)
AS

DECLARE @QueryId nvarchar(150)
DECLARE @userId nvarchar(150)

PRINT @Query

--SELECT @QueryId = HQ.HistoricQueryId,  @userId = HQ.UserId FROM dbo.QueryLog QL
--JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
--JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
--WHERE M.UserName = @username AND QL.Query like @Query


SELECT TOP 1 HQ.HistoricQueryId FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
JOIN dbo.UserQuerySubscription US ON HQ.HistoricQueryId = US.QueryHistoricId
WHERE M.UserName = @Username AND QL.Query like @Query



--PRINT @QueryId
--PRINT @userId


----PRINT N'HistoricQueryId -> ' + @historicQueryId
----PRINT N'UserId -> ' + @userId

----PRINT N'Query -> ' + @Query

--SELECT DD.QueryHistoricId FROM [dbo].UserQuerySubscription DD
--WHERE DD.QueryHistoricId = @QueryId

--INSERT INTO [dbo].UserQuerySubscription (QueryHistoricId, UserId)
--VALUES (@historicQueryId, @userId)








GO
/****** Object:  StoredProcedure [dbo].[proc_CheckUserLoginStatus]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROC [dbo].[proc_CheckUserLoginStatus]

@Username [nvarchar](max),
@Token [nvarchar](max)
AS

BEGIN
	SELECT LoggedIn FROM [dbo].[UserSession] DD 
	JOIN dbo.[AspNetUsers] AU ON DD.UserId = AU.Id WHERE AU.Username = @Username	
END




GO
/****** Object:  StoredProcedure [dbo].[proc_CreateNewUser]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_CreateNewUser]

@username [nvarchar](max),
@email [nvarchar](128),
@firstname [nvarchar](128),
@lastname [nvarchar](128),
@phone [nvarchar](128),
@country [nvarchar](50),
@broker [nvarchar](128),
@organisation [nvarchar](128),
@password [nvarchar](128),
@passwordSalt [nvarchar](128),
@userexists bit OUTPUT

AS
DECLARE @UserId int

BEGIN
	
	--SELECT 1 dbo.UserProfile GH WHERE GH.Username = @username
	IF EXISTS (SELECT 1 FROM dbo.UserProfile WHERE dbo.UserProfile.Username = @username)
		BEGIN
			PRINT 'User exists'; 
		END
	ELSE
			INSERT INTO dbo.UserProfile([UserName])
			VALUES (@username)

			SELECT @UserId = UserId FROM dbo.UserProfile UR
			WHERE UR.UserName = @username

			INSERT INTO dbo.webpages_Membership(
				[UserId],
				[CreateDate],
				[ConfirmationToken],
				[IsConfirmed],
				[LastPasswordFailureDate],
				[PasswordFailuresSinceLastSuccess],
				[Password],
				[PasswordChangedDate],
				[PasswordSalt],
				[PasswordVerificationToken],
				[PasswordVerificationTokenExpirationDate],
				[Email],
				[FirstName],
				[LastName],
				[Phone],
				[Country],
				[Broker],
				[Organisation]
			)
			VALUES (
				@userId,
				GETDATE(),
				NULL,
				NULL,
				NULL,
				0,
				@password,
				GETDATE(),
				@passwordSalt,
				NULL,
				NULL,
				@email,
				@firstName,
				@lastName,
				@phone,
				@country,
				@broker,
				@organisation
			)
			RETURN
END







GO
/****** Object:  StoredProcedure [dbo].[proc_DeleteUser]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[proc_DeleteUser]
@username [nvarchar](128)

AS

BEGIN
	DECLARE @userId int

	SELECT @userId = UserId FROM dbo.UserProfile D
	WHERE D.UserName = @username

	DELETE dbo.UserProfile FROM dbo.UserProfile D
	WHERE D.UserId = @userId

	DELETE dbo.webpages_Membership FROM dbo.webpages_Membership M
	WHERE M.UserId = @userId
END





GO
/****** Object:  StoredProcedure [dbo].[proc_GetSessionDateTimes]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROC [dbo].[proc_GetSessionDateTimes]

@Username [nvarchar](max),
@Token [nvarchar](max)
AS

BEGIN
	SELECT [StartDateTime], [EndDateTime] FROM [dbo].[UserSession] DD 
	JOIN dbo.[AspNetUsers] AU ON DD.UserId = AU.Id WHERE AU.Username = @Username	
END




GO
/****** Object:  StoredProcedure [dbo].[proc_GetUser]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[proc_GetUser]
@username [nvarchar](max)
AS
DECLARE @UserId int

BEGIN
	
	--SELECT * FROM dbo.UserProfile D
	--JOIN dbo.webpages_Membership M ON D.UserId = M.UserId
	--WHERE D.UserName = @username

	SELECT * FROM [TRUserManagement].[dbo].MembershipProfile DD
	JOIN [TRUserManagement].[dbo].[AspNetUsers] GG ON DD.UserId = GG.Id
	WHERE GG.UserName = @username

END







GO
/****** Object:  StoredProcedure [dbo].[proc_GetUser_Token]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_GetUser_Token]
@token [nvarchar](max)
AS
DECLARE @UserId int

BEGIN
	
	SELECT * FROM [dbo].MembershipProfile DD
	JOIN [dbo].[AspNetUsers] GG ON DD.UserId = GG.Id
	JOIN [dbo].[UserSession] VV ON GG.Id = VV.UserId
	WHERE VV.CurrentAccessToken = @token

END








GO
/****** Object:  StoredProcedure [dbo].[proc_GetUser_Username]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_GetUser_Username]
@username [nvarchar](max)
AS
DECLARE @UserId int

BEGIN
	
	SELECT * FROM [dbo].MembershipProfile DD
	JOIN [dbo].[AspNetUsers] GG ON DD.UserId = GG.Id
	JOIN [dbo].[UserSession] VV ON GG.Id = VV.UserId
	WHERE GG.UserName = @username

END








GO
/****** Object:  StoredProcedure [dbo].[proc_GetUserQuerySubscriptionBasic]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_GetUserQuerySubscriptionBasic]
AS

--SELECT Query, Username FROM dbo.QueryLog QL
--JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
--JOIN dbo.webpages_Membership M ON HQ.UserId = M.UserId
--JOIN dbo.UserProfile P ON M.UserId = P.UserId
--JOIN dbo.UserQuerySubscription UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId


SELECT Query, Username FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
JOIN dbo.UserQuerySubscription UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId







GO
/****** Object:  StoredProcedure [dbo].[proc_LoginUser]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [dbo].[proc_LoginUser]

@Username [nvarchar](max),
@CurrentAccessToken [nvarchar](max),
@StartDateTime smalldatetime,
@EndDateTime smalldatetime
AS
DECLARE @UserId [nvarchar](128)
DECLARE @UserIdCount int
BEGIN

--SELECT @UserId = [Id] FROM [dbo].[AspNetUsers] DD WHERE DD.UserName = @Username
--INSERT INTO [dbo].[UserSession]
--				   ([Id]
--				   ,[UserId]
--				   ,[CurrentAccessToken]
--				   ,[StartDateTime]
--				   ,[EndDateTime]
--				   ,[LoggedIn])
--			 VALUES
--				   (NewID()
--				   ,@UserId
--				   ,@CurrentAccessToken
--				   ,@StartDateTime
--				   ,@EndDateTime
--				   , 1)


	SELECT @UserId = [Id] FROM [dbo].[AspNetUsers] DD WHERE DD.UserName = @Username

	SELECT @UserIdCount = COUNT([Id]) FROM [dbo].[UserSession] DD WHERE DD.UserId= @UserId
	PRINT @UserIdCount
	IF (@UserIdCount = 1)
	BEGIN
		UPDATE [dbo].[UserSession] SET [dbo].[UserSession].StartDateTime = @StartDateTime,
		[dbo].[UserSession].EndDateTime = @EndDateTime, [dbo].[UserSession].[LoggedIn] = 1
		WHERE [dbo].[UserSession].UserId = @UserId
	END
	ELSE	
		INSERT INTO [dbo].[UserSession]
				   ([Id]
				   ,[UserId]
				   ,[CurrentAccessToken]
				   ,[StartDateTime]
				   ,[EndDateTime]
				   ,[LoggedIn])
			 VALUES
				   (NewID()
				   ,@UserId
				   ,@CurrentAccessToken
				   ,@StartDateTime
				   ,@EndDateTime
				   , 1)


	--IF NOT EXISTS (SELECT 1 FROM [dbo].[AspNetUsers] DD WHERE DD.UserName = @Username)
	--BEGIN

	--	INSERT INTO [dbo].[UserSession]
	--			   ([Id]
	--			   ,[UserId]
	--			   ,[CurrentAccessToken]
	--			   ,[StartDateTime]
	--			   ,[EndDateTime]
	--			   ,[LoggedIn])
	--		 VALUES
	--			   (NewID()
	--			   ,@UserId
	--			   ,@CurrentAccessToken
	--			   ,@StartDateTime
	--			   ,@EndDateTime
	--			   , 1)
	--END
	--ELSE
	--	UPDATE [dbo].[UserSession] SET [dbo].[UserSession].StartDateTime = @StartDateTime,
	--	[dbo].[UserSession].EndDateTime = @EndDateTime, [dbo].[UserSession].[LoggedIn] = 1
	--	WHERE [dbo].[UserSession].UserId = @UserId
	
	--Run Updates
	
END








GO
/****** Object:  StoredProcedure [dbo].[proc_LoginUserTest]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROC [dbo].[proc_LoginUserTest]

@Username [nvarchar](max)
AS
DECLARE @UserId [nvarchar](128)

BEGIN

		INSERT INTO [dbo].[TestTable]
				   ([Muppet])
			 VALUES
				   (@Username)


	--IF NOT EXISTS (SELECT 1 FROM [dbo].[AspNetUsers] DD WHERE DD.UserName = @Username)
	--BEGIN

	--	INSERT INTO [dbo].[UserSession]
	--			   ([Id]
	--			   ,[UserId]
	--			   ,[CurrentAccessToken]
	--			   ,[StartDateTime]
	--			   ,[EndDateTime]
	--			   ,[LoggedIn])
	--		 VALUES
	--			   (NewID()
	--			   ,@UserId
	--			   ,@CurrentAccessToken
	--			   ,@StartDateTime
	--			   ,@EndDateTime
	--			   , 1)
	--END
	--ELSE
	--	UPDATE [dbo].[UserSession] SET [dbo].[UserSession].StartDateTime = @StartDateTime,
	--	[dbo].[UserSession].EndDateTime = @EndDateTime, [dbo].[UserSession].[LoggedIn] = 1
	--	WHERE [dbo].[UserSession].UserId = @UserId
	
	--Run Updates
	
END









GO
/****** Object:  StoredProcedure [dbo].[proc_LogoutUser]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROC [dbo].[proc_LogoutUser]

@Username [nvarchar](max),
@CurrentAccessToken [nvarchar](max)
AS
DECLARE @UserId [nvarchar](128)

BEGIN

	SELECT @UserId = [Id] FROM [dbo].[AspNetUsers] DD WHERE DD.UserName = @Username

	UPDATE [dbo].[UserSession] SET [dbo].[UserSession].[LoggedIn] = 0
	WHERE [dbo].[UserSession].UserId = @UserId

END









GO
/****** Object:  StoredProcedure [dbo].[proc_LogQuery]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[proc_LogQuery]
@Query nvarchar(MAX),
@Answered bit,
@Username nvarchar(MAX)
AS

DECLARE @userID nvarchar(MAX)
DECLARE @queryLogId nvarchar(MAX)

SET @queryLogId = NEWID()

INSERT INTO [dbo].QueryLog (QueryLogId, Query, [Timestamp], Answered)
VALUES (@queryLogId, @Query, CURRENT_TIMESTAMP, @Answered)

SELECT @userID = M.Id FROM dbo.AspNetUsers M
WHERE M.UserName = @Username

INSERT INTO [dbo].HistoricQueries (HistoricQueryId, QueryLogId, UserId)
VALUES (NEWID(), @queryLogId, @userID)






GO
/****** Object:  StoredProcedure [dbo].[proc_RegisterToken]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROC [dbo].[proc_RegisterToken]

@Username [nvarchar](max),
@Token [nvarchar](max)
AS
DECLARE @UserId [nvarchar](128)
DECLARE @UserIdCount int
BEGIN

	SELECT @UserId = [Id] FROM [dbo].[AspNetUsers] DD WHERE DD.UserName = @Username

	SELECT @UserIdCount = COUNT([Id]) FROM [dbo].[UserSession] DD WHERE DD.UserId= @UserId
	PRINT @UserIdCount
	IF (@UserIdCount = 1)
	BEGIN
		UPDATE [dbo].[UserSession] SET [dbo].[UserSession].CurrentAccessToken = @Token		
		WHERE [dbo].[UserSession].UserId = @UserId AND [dbo].[UserSession].[LoggedIn] = 1
	END
END








GO
/****** Object:  StoredProcedure [dbo].[proc_SaveQuery]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[proc_SaveQuery]
@Query nvarchar(MAX),
@Username nvarchar(MAX)
AS

DECLARE @historicQueryId nvarchar(150)
DECLARE @userId nvarchar(150)

PRINT @Query

SELECT @historicQueryId = HistoricQueryId,  @userId = HQ.UserId FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
WHERE M.UserName = @username AND QL.Query like @Query


PRINT @historicQueryId
PRINT @userId

INSERT INTO [dbo].UserSavedQueries (QueryHistoricId, UserId)
VALUES (@historicQueryId, @userId)








GO
/****** Object:  StoredProcedure [dbo].[proc_SubscribeToQuery]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[proc_SubscribeToQuery]
@Query nvarchar(MAX),
@Username nvarchar(MAX)
AS

DECLARE @historicQueryId nvarchar(150)
DECLARE @userId nvarchar(150)

PRINT @Query

--SELECT @historicQueryId = HistoricQueryId,  @userId = HQ.UserId FROM dbo.QueryLog QL
--JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
--JOIN dbo.webpages_Membership M ON HQ.UserId = M.UserId
--JOIN dbo.UserProfile P ON M.UserId = P.UserId
--WHERE P.UserName = @Username AND QL.Query = @Query


SELECT @historicQueryId = HistoricQueryId,  @userId = HQ.UserId FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
WHERE M.UserName = @username AND QL.Query like @Query


PRINT @historicQueryId
PRINT @userId


--PRINT N'HistoricQueryId -> ' + @historicQueryId
--PRINT N'UserId -> ' + @userId

--PRINT N'Query -> ' + @Query

INSERT INTO [dbo].UserQuerySubscription (QueryHistoricId, UserId)
VALUES (@historicQueryId, @userId)







GO
/****** Object:  StoredProcedure [dbo].[proc_UnsaveUserQueries]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_UnsaveUserQueries]
@username nvarchar(MAX),
@query nvarchar(MAX)
AS

DECLARE @historicId nvarchar(MAX)
DECLARE @TempQueryListingTable table(historicId nvarchar(MAX), Query nvarchar(MAX));

SELECT @historicId = HistoricQueryId FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
JOIN dbo.UserSavedQueries UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId
WHERE M.UserName = @username AND QL.Query like @query


 DELETE FROM [dbo].[UserSavedQueries] 
 WHERE [dbo].[UserSavedQueries].QueryHistoricId = @historicId




GO
/****** Object:  StoredProcedure [dbo].[proc_UnsubscribeToQuery]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[proc_UnsubscribeToQuery]
@username nvarchar(MAX),
@query nvarchar(MAX)
AS

DECLARE @historicId nvarchar(MAX)
DECLARE @TempQueryListingTable table(historicId nvarchar(MAX), Query nvarchar(MAX));

--BEGIN
--	INSERT INTO @TempQueryListingTable

--	SELECT HistoricQueryId, Query FROM dbo.QueryLog QL
--	JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
--	JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
--	WHERE M.UserName = @username AND QL.Query = @query

--	DELETE FROM [dbo].[UserQuerySubscription] WHERE [dbo].[UserQuerySubscription].QueryHistoricId 
--	IN (SELECT historicId FROM @TempQueryListingTable);
--END



	SELECT @historicId = HistoricQueryId FROM dbo.QueryLog QL
	JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
	JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
	JOIN dbo.UserQuerySubscription UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId
	WHERE M.UserName = @username AND QL.Query like @query


 DELETE FROM [dbo].[UserQuerySubscription] 
 WHERE [dbo].[UserQuerySubscription].QueryHistoricId = @historicId



GO
/****** Object:  StoredProcedure [dbo].[proc_ViewAllUserQueries]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_ViewAllUserQueries]
@username nvarchar(MAX)
AS

BEGIN
	SELECT * FROM dbo.QueryLog QL
	JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
	JOIN dbo.webpages_Membership M ON HQ.UserId = M.UserId
	JOIN dbo.UserProfile P ON M.UserId = P.UserId
	WHERE P.UserName = @username ORDER BY QL.Timestamp DESC
END





GO
/****** Object:  StoredProcedure [dbo].[proc_ViewAllUserQueries_Like]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROC [dbo].[proc_ViewAllUserQueries_Like]
@username nvarchar(MAX),
@query nvarchar(MAX)
AS

BEGIN
	SELECT * FROM dbo.QueryLog QL
	JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
	JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
	WHERE M.UserName = @username AND QL.Query like '%'+ @query +'%'
	ORDER BY QL.Timestamp DESC


	--SELECT * FROM dbo.QueryLog QL
	--JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
	--JOIN dbo.MembershipProfile M ON HQ.UserId = M.UserId
	--JOIN dbo.UserProfile P ON M.UserId = P.UserId
	--WHERE P.UserName = @username AND QL.Query like '%'+ @query +'%'
	--ORDER BY QL.Timestamp DESC

END






GO
/****** Object:  StoredProcedure [dbo].[proc_ViewUserQueries]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[proc_ViewUserQueries]
@username nvarchar(MAX)
AS
BEGIN
	SELECT TOP 15 * FROM dbo.QueryLog QL
	JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
	JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
	WHERE M.UserName = @username ORDER BY QL.Timestamp DESC


	--SELECT TOP 15 * FROM dbo.QueryLog QL
	--JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
	--JOIN dbo.webpages_Membership M ON HQ.UserId = M.UserId
	--JOIN dbo.UserProfile P ON M.UserId = P.UserId
	--WHERE P.UserName = @username ORDER BY QL.Timestamp DESC
END





GO
/****** Object:  StoredProcedure [dbo].[proc_ViewUserQuerySubscription]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[proc_ViewUserQuerySubscription]
@username nvarchar(MAX)
AS

--SELECT * FROM dbo.QueryLog QL
--JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
--JOIN dbo.webpages_Membership M ON HQ.UserId = M.UserId
--JOIN dbo.UserProfile P ON M.UserId = P.UserId
--JOIN dbo.UserQuerySubscription UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId
--WHERE P.UserName = @username ORDER BY QL.Timestamp DESC

SELECT * FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
JOIN dbo.UserQuerySubscription UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId
WHERE M.UserName = @username ORDER BY QL.Timestamp DESC





GO
/****** Object:  StoredProcedure [dbo].[proc_ViewUserSavedQueries]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[proc_ViewUserSavedQueries]
@username nvarchar(MAX)
AS

SELECT * FROM dbo.QueryLog QL
JOIN dbo.HistoricQueries HQ ON QL.QueryLogId = HQ.QueryLogId
JOIN dbo.AspNetUsers M ON HQ.UserId = M.Id
JOIN dbo.UserSavedQueries UQS ON HQ.HistoricQueryId = UQS.QueryHistoricId
WHERE M.UserName = @username ORDER BY QL.Timestamp DESC






GO
/****** Object:  StoredProcedure [membership].[PasswordHistorySelect]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[PasswordHistorySelect]
	@UserID	UNIQUEIDENTIFIER
AS

SET NOCOUNT ON

SELECT	[UserId],
		[CreateDate],
		[Password] 
  FROM	[membership].[PasswordHistory] WITH (NOLOCK)
  WHERE [UserId] = @UserID


GO
/****** Object:  StoredProcedure [membership].[PolicySelect]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[PolicySelect]
  @Container	NVARCHAR(50)
AS

SET NOCOUNT ON

SELECT	[Container],
		[Name],
		[Enabled],
		[Value]
  FROM	[membership].[Policy]
  WHERE [Container] = @Container


GO
/****** Object:  StoredProcedure [membership].[PolicyUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[PolicyUpdate]
    @Container	NVARCHAR(50),
    @Name		NVARCHAR(50),
    @Enabled	BIT,
    @Value		INT	= NULL

AS

SET NOCOUNT ON 

-- ERROR HANDLING
DECLARE   @ErrorLine			INT
        , @ErrorMessage			NVARCHAR(4000)

BEGIN TRY

    UPDATE	[membership].[Policy] WITH (READPAST ROWLOCK)
       SET	[Value]		= @Value,
            [Enabled]	= @Enabled
     WHERE	[Container]	= @Container
       AND	[Name]		= @Name

    IF @@ROWCOUNT = 0
    BEGIN		

        INSERT INTO [membership].[Policy] ([Container], [Name], [Enabled], [Value])
        SELECT @Container, @Name, @Enabled, @Value
        
    END

    RETURN 1
END TRY

BEGIN CATCH
    SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);

     --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Policy', '[membership].PolicyUpdate', 4, @ErrorMessage, '[membership].[PolicyUpdate]', @ErrorLine	

    RETURN 0
END CATCH


GO
/****** Object:  StoredProcedure [membership].[UserInvalidLoginUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [membership].[UserInvalidLoginUpdate]
    @UserID					UNIQUEIDENTIFIER = NULL
AS 
	
SET NOCOUNT ON 

DECLARE @ErrorMessage	VARCHAR(4000),	
        @ErrorLine	INT,
		@ErrorNumber		INT,
		@ErrorSeverity		INT,
		@ErrorState			INT

BEGIN TRY

	UPDATE	[membership].[Users]
	SET		[InvalidLogonAttempts]	= InvalidLogonAttempts + 1
	WHERE	[UserID] = @UserID

	RETURN 1

END TRY

BEGIN CATCH

	SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);
	SET @ErrorNumber = ERROR_NUMBER()
	SET @ErrorSeverity = ERROR_SEVERITY()
	SET @ErrorState = ERROR_STATE()	

    --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Users', '[membership].UserInvalidLoginUpdate', 4, @ErrorMessage, '[membership].[UserInvalidLoginUpdate]', @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID					

    RETURN 0

END CATCH

GO
/****** Object:  StoredProcedure [membership].[UserLockAccountUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[UserLockAccountUpdate]
    @UserID					UNIQUEIDENTIFIER = NULL
AS 
	
SET NOCOUNT ON 

DECLARE @ErrorMessage	VARCHAR(4000),	
        @ErrorLine	INT,
		@ErrorNumber		INT,
		@ErrorSeverity		INT,
		@ErrorState			INT

BEGIN TRY

	UPDATE	[membership].[Users]
	SET		[Locked]				= 1, 
			[LastLockDate]			= GETUTCDATE(),
			[InvalidLogonAttempts]	= InvalidLogonAttempts + 1
	WHERE	[UserID] = @UserID
	
	RETURN 1

END TRY

BEGIN CATCH

	SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);
	SET @ErrorNumber = ERROR_NUMBER()
	SET @ErrorSeverity = ERROR_SEVERITY()
	SET @ErrorState = ERROR_STATE()	

    --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Users', '[membership].UserLockAccountUpdate', 4, @ErrorMessage, '[membership].[UserLockAccountUpdate]', @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID					

    RETURN 0

END CATCH


GO
/****** Object:  StoredProcedure [membership].[UserPasswordResetDelete]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


crEate PROC [membership].[UserPasswordResetDelete]
    @UserID			UNIQUEIDENTIFIER
AS 
    
SET NOCOUNT ON 

-- Error Handling
DECLARE @ErrorMessage	VARCHAR(4000)
        , @ErrorLine	INT
		, @ErrorNumber			INT
		, @ErrorSeverity		INT
		, @ErrorState			INT
		

BEGIN TRY

    DELETE [membership].[UserPasswordReset] WITH (READPAST ROWLOCK)
    WHERE [UserID] = @UserID

	RETURN 1

END TRY

BEGIN CATCH

    SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1)
	SET @ErrorNumber = ERROR_NUMBER()
	SET @ErrorSeverity = ERROR_SEVERITY()
	SET @ErrorState = ERROR_STATE()

    --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Users', '[membership].UserPasswordResetDelete', 4, @ErrorMessage, '[membership].[UserPasswordResetDelete]', @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID					

    RETURN 0

END CATCH

GO
/****** Object:  StoredProcedure [membership].[UserPasswordResetInsert]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


create PROC [membership].[UserPasswordResetInsert]
    @UserID			UNIQUEIDENTIFIER,
    @ResetToken		UNIQUEIDENTIFIER
AS 
    
SET NOCOUNT ON 

-- ERROR HANDLING
DECLARE   @ErrorLine		INT
        , @ErrorProcedure	NVARCHAR(200)
        , @ErrorMessage		NVARCHAR(4000)
		, @ErrorNumber			INT
		, @ErrorSeverity		INT
		, @ErrorState			INT

BEGIN TRY
    BEGIN TRANSACTION

    -- check if a password reset request already exists
    IF EXISTS (SELECT 1 FROM [membership].[UserPasswordReset] WHERE UserID = @UserID) BEGIN
        -- delete all existing requests
        exec [membership].[UserPasswordResetDelete] @UserID
    END

    -- insert the new password reset request.
    INSERT INTO [membership].[UserPasswordReset]
    SELECT @UserID, @ResetToken, GETUTCDATE()

    COMMIT TRANSACTION
    RETURN 1
END TRY

BEGIN CATCH
    ROLLBACK TRANSACTION;

        SELECT	  @ErrorLine		= ISNULL(ERROR_LINE (), -1)		 
                , @ErrorProcedure	= ISNULL(ERROR_PROCEDURE(), '-')
                , @ErrorMessage		= ISNULL(ERROR_MESSAGE(), '-')
				, @ErrorNumber = ERROR_NUMBER()
				, @ErrorSeverity = ERROR_SEVERITY()
				, @ErrorState = ERROR_STATE()	
        --Create a Log entry for error
        EXEC [traderiser].[LogExceptionInsert] 'DBServer - Users', '[membership].UsersPasswordResetInsert', 4, @ErrorMessage, @ErrorProcedure, @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID	

    RETURN 0
END CATCH

GO
/****** Object:  StoredProcedure [membership].[UserPasswordResetSelect]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


create PROC [membership].[UserPasswordResetSelect]
	@ResetToken		UNIQUEIDENTIFIER
AS 
	
SET NOCOUNT ON 

	SELECT	R.[UserID], 
			R.[ResetToken], 
			R.[InsertedDateTime], 
			U.[UserName]
	FROM [membership].[UserPasswordReset] R with(nolock)
	INNER JOIN [membership].[Users] U
	ON U.UserID = R.UserID
	WHERE R.ResetToken = @ResetToken

GO
/****** Object:  StoredProcedure [membership].[UsersForcePasswordChange]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[UsersForcePasswordChange]
(
	@UserID				UNIQUEIDENTIFIER,
	@ChangePasswordFlg	BIT
)

AS

UPDATE	[membership].[Users] WITH (READPAST ROWLOCK)
   SET	[ChangePassword]	= @ChangePasswordFlg,
		[LastUpdated]		= GETUTCDATE()
 WHERE	[UserID]			= @UserID

IF @@ROWCOUNT = 1
	RETURN 1
ELSE
	RETURN 0


GO
/****** Object:  StoredProcedure [membership].[UsersPasswordUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [membership].[UsersPasswordUpdate] 
    @UserID UNIQUEIDENTIFIER,
    @Password NVARCHAR(300),
    @HistoryPassword NVARCHAR(300) = NULL,
    @ForceChange BIT = 0
AS 
    
SET NOCOUNT ON 

-- ERROR HANDLING
DECLARE   @ErrorLine		INT
		, @ErrorProcedure	NVARCHAR(200)
		, @ErrorMessage		NVARCHAR(4000)
		, @ErrorNumber			INT
		, @ErrorSeverity		INT
		, @ErrorState			INT

BEGIN TRY
    BEGIN TRANSACTION

    UPDATE [membership].[Users] WITH (READPAST ROWLOCK)
       SET [Password]  = @Password,
           [LastPasswordReset] = GETUTCDATE(),
           [ChangePassword] = @ForceChange
     WHERE [UserID] = @UserID
     
     IF @@ROWCOUNT > 0
     BEGIN
     
        IF @HistoryPassword IS NOT NULL
            BEGIN
                INSERT INTO [membership].[PasswordHistory] ([UserId], [CreateDate], [Password])
                SELECT @UserID, GETUTCDATE(), @HistoryPassword

				DECLARE @PasswordHistoryRetention INT,
						@PasswordHistoryCount INT

				SET @PasswordHistoryRetention = (SELECT [Value] FROM [membership].[Policy] WHERE Container = 'Membership' AND Name = 'PasswordHistory')
				SET @PasswordHistoryCount = (SELECT COUNT(UserId) FROM [membership].[PasswordHistory] WHERE UserId = @UserID)

				IF @PasswordHistoryCount > @PasswordHistoryRetention
				BEGIN
					WITH PH AS
					(
						SELECT TOP (@PasswordHistoryCount - @PasswordHistoryRetention) *
						FROM    [membership].[PasswordHistory]
						WHERE UserId = @UserID
						ORDER BY CreateDate ASC
					)
					DELETE
					FROM PH
				END


            END
     END
    
    COMMIT TRANSACTION
    RETURN 1
END TRY

BEGIN CATCH
    ROLLBACK TRANSACTION;

	SELECT	  @ErrorLine		= ISNULL(ERROR_LINE (), -1)		 
			, @ErrorProcedure	= ISNULL(ERROR_PROCEDURE(), '-')
			, @ErrorMessage		= ISNULL(ERROR_MESSAGE(), '-')
			, @ErrorNumber = ERROR_NUMBER()
			, @ErrorSeverity = ERROR_SEVERITY()
			, @ErrorState = ERROR_STATE()	

	--Create a Log entry for error
	EXEC [membership].[LogExceptionInsert] 'DBServer - UserPreferences', '[membership].UsersUpdate', 4, @ErrorMessage, @ErrorProcedure, @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID					
	
    RETURN 0
END CATCH


GO
/****** Object:  StoredProcedure [membership].[UsersSelect]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [membership].[UsersSelect] 
AS 

SET NOCOUNT ON 

	SELECT	 [UserID]
			,[UserName]
			,[Email]
			,[FirstName]
			,[LastName]
			,[Phone1]
			,[Phone2]
			,[Language]
			,[TimeZone]
			,[Locked]
			,[Disabled]
			,[ChangePassword]
			,[Password]
			,[LastPasswordReset]
			,[CreateDate]
			,[LastLoginDate]
			,[LastLockDate]
			,[InvalidLogonAttempts]
			,[Photo]
			,[BrandID]
			,[Deleted]			
			,[LastName] + ', ' + [FirstName] AS 'DisplayName'
			,[EmployeeID]
			,[OutOfOfficeFlg]
			,[DelegateUserID]
			,[UserPreferences]
			,[LastUpdated]
			,[UserType]
			,[SendAlertsAsEmail]
			,[EscalationUserID]
			,[PrimaryLocationID]
			 ,[Country]
			,[Broker]
		--,RRL.[RepoRoot] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'RepoRoot'
		--,WRL.[Workspace] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'WorkspaceRoot'
  FROM	[membership].[Users] U WITH (NOLOCK)
 -- LEFT JOIN [secure].[RepoRootLocations] RRL WITH (NOLOCK) ON U.[RepoRootID] = RRL.[Id]
  --LEFT JOIN [secure].[WorkspaceRootLocations] WRL WITH (NOLOCK) ON U.[WorkspaceID] = WRL.[Id]
	WHERE [Deleted] = 0
	  AND [UserName] != 'Anonymous'
	ORDER BY [LastName] ASC

GO
/****** Object:  StoredProcedure [membership].[UsersSelectByEmail]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [membership].[UsersSelectByEmail]
(
       @Email NVARCHAR(256)
)

AS 

SET NOCOUNT ON 

SELECT	[UserID]
		,[UserName]
		,[Email]
		,[FirstName]
		,[LastName]
		,[Phone1]
		,[Phone2]
		,[Language]
		,[TimeZone]
		,[Locked]
		,[Disabled]
		,[ChangePassword]
		,[Password]
		,[LastPasswordReset]
		,[CreateDate]
		,[LastLoginDate]
		,[LastLockDate]
		,[InvalidLogonAttempts]
		,[Photo]
		,[BrandID]
		,[Deleted]
		,[LastName] + ', ' + [FirstName] AS 'DisplayName'
		,[EmployeeID]
		,[OutOfOfficeFlg]
		,[DelegateUserID]
		,[UserPreferences]
		,[LastUpdated]
		,[UserType]
		,[SendAlertsAsEmail]
		,[EscalationUserID]
		,[PrimaryLocationID]
		 ,[Country]
      ,[Broker]
	--	,RRL.[RepoRoot] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'RepoRoot'
	--	,WRL.[Workspace] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'WorkspaceRoot'
  FROM	[membership].[Users] U WITH (NOLOCK)
 -- LEFT JOIN [secure].[RepoRootLocations] RRL WITH (NOLOCK) ON U.[RepoRootID] = RRL.[Id]
 -- LEFT JOIN [secure].[WorkspaceRootLocations] WRL WITH (NOLOCK) ON U.[WorkspaceID] = WRL.[Id]
 WHERE LOWER([Email]) = LOWER(@Email)
   AND [Deleted] = 0
-- ORDER BY [LastName] ASC

GO
/****** Object:  StoredProcedure [membership].[UsersSelectByID]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[UsersSelectByID]
(
       @UserID UNIQUEIDENTIFIER
)

AS 

SET NOCOUNT ON 

SELECT	[UserID]
        ,[UserName]
		,[Email]
		,[FirstName]
		,[LastName]
		,[Phone1]
		,[Phone2]
		,[Language]
		,[TimeZone]
		,[Locked]
		,[Disabled]
		,[ChangePassword]
		,[Password]
		,[LastPasswordReset]
		,[CreateDate]
		,[LastLoginDate]
		,[LastLockDate]
		,[InvalidLogonAttempts]
		,[Photo]
		,[BrandID]
		,[Deleted]
		,[LastName] + ', ' + [FirstName] AS 'DisplayName'
		,[EmployeeID]
		,[OutOfOfficeFlg]
		,[DelegateUserID]
		,[UserPreferences]
		,[LastUpdated]
		,[UserType]
		,[SendAlertsAsEmail]
		,[EscalationUserID]
		,[PrimaryLocationID]
		 ,[Country]
      ,[Broker]
		--,RRL.[RepoRoot] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'RepoRoot'
		--,WRL.[Workspace] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'WorkspaceRoot'
  FROM	[membership].[Users] U WITH (NOLOCK)
  --LEFT JOIN [secure].[RepoRootLocations] RRL WITH (NOLOCK) ON U.[RepoRootID] = RRL.[Id]
 -- LEFT JOIN [secure].[WorkspaceRootLocations] WRL WITH (NOLOCK) ON U.[WorkspaceID] = WRL.[Id]
 WHERE [UserID] = @UserID
   AND [Deleted] = 0
 --ORDER BY [LastName] ASC

GO
/****** Object:  StoredProcedure [membership].[UsersSelectByUserName]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [membership].[UsersSelectByUserName]
(
       @UserName NVARCHAR(256)
)

AS 

SET NOCOUNT ON 

SELECT	[UserID]
		,[UserName]
		,[Email]
		,[FirstName]
		,[LastName]
		,[Phone1]
		,[Phone2]
		,[Language]
		,[TimeZone]
		,[Locked]
		,[Disabled]
		,[ChangePassword]
		,[Password]
		,[LastPasswordReset]
		,[CreateDate]
		,[LastLoginDate]
		,[LastLockDate]
		,[InvalidLogonAttempts]
		,[Photo]
		,[BrandID]
		,[Deleted]
		,[LastName] + ', ' + [FirstName] AS 'DisplayName'
		,[EmployeeID]
		,[OutOfOfficeFlg]
		,[DelegateUserID]
		,[UserPreferences]
		,[LastUpdated]
		,[UserType]
		,[SendAlertsAsEmail]
		,[EscalationUserID]
		,[PrimaryLocationID]
		 ,[Country]
      ,[Broker]
	--	,RRL.[RepoRoot] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'RepoRoot'
	--	,WRL.[Workspace] + '\' + CAST([UserID] AS NVARCHAR(40)) AS 'WorkspaceRoot'
  FROM	[membership].[Users] U WITH (NOLOCK)
--  LEFT JOIN [secure].[RepoRootLocations] RRL WITH (NOLOCK) ON U.[RepoRootID] = RRL.[Id]
--  LEFT JOIN [secure].[WorkspaceRootLocations] WRL WITH (NOLOCK) ON U.[WorkspaceID] = WRL.[Id]
 WHERE [UserName] = @UserName
   AND [Deleted] = 0


GO
/****** Object:  StoredProcedure [membership].[UserSuccessfulLoginUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [membership].[UserSuccessfulLoginUpdate]
    @UserID					UNIQUEIDENTIFIER = NULL,
	@Timezone				NVARCHAR(256)
AS 
	
SET NOCOUNT ON 

DECLARE @ErrorMessage	VARCHAR(4000),	
        @ErrorLine	INT,
		@ErrorNumber		INT,
		@ErrorSeverity		INT,
		@ErrorState			INT

BEGIN TRY

	UPDATE	[membership].[Users]
	SET		[Locked]				= 0, 
			[LastLoginDate]			= GETUTCDATE(),
			[LastLockDate]			= NULL,
			[InvalidLogonAttempts]	= 0,
			[TimeZone]				= @Timezone
	WHERE	[UserID] = @UserID


	RETURN 1

END TRY

BEGIN CATCH

	SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);
	SET @ErrorNumber = ERROR_NUMBER()
	SET @ErrorSeverity = ERROR_SEVERITY()
	SET @ErrorState = ERROR_STATE()	

    --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Users', '[membership].UserLockAccountUpdate', 4, @ErrorMessage, '[membership].[UserLockAccountUpdate]', @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID					

    RETURN 0

END CATCH


GO
/****** Object:  StoredProcedure [membership].[UsersUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [membership].[UsersUpdate]
(
    @UserID					UNIQUEIDENTIFIER OUTPUT,
    @UserName				NVARCHAR(256),
    @Email					NVARCHAR(256),
    @FirstName				NVARCHAR(100),
    @LastName				NVARCHAR(100),
    @Phone1					NVARCHAR(30) = NULL,
    @Phone2					NVARCHAR(30) = NULL,
    @Language				NVARCHAR(15) = "en-GB",
    @TimeZone				NVARCHAR(256),
    @Locked					BIT,
    @Disabled				BIT,
    @ChangePassword			BIT,
    @Password				NVARCHAR(300),
    @LastPasswordReset		DATETIME,
    @CreateDate				DATETIME = NULL,
    @LastLoginDate			DATETIME = NULL,
    @LastLockDate			DATETIME = NULL,
    @InvalidLogonAttempts	SMALLINT,
    @BrandID				UNIQUEIDENTIFIER,
	@EmployeeID				NVARCHAR(20) = NULL,
	@OutOfOfficeFlg			BIT = 0,
	@DelegateUserID			UNIQUEIDENTIFIER = NULL,
	@UserPreferences		NVARCHAR(MAX) = NULL,
	@UserType				VARCHAR(20) = 'Normal',
	@SendAlertsAsEmail		BIT = 1,
	@EscalationUserID		UNIQUEIDENTIFIER = NULL,
	@PrimaryLocationID		VARCHAR(20) = NULL,
	@Country				VARCHAR(50) = NULL,
    @Broker					VARCHAR(50) = NULL
)

AS 
	
SET NOCOUNT ON 

-- ERROR HANDLING
DECLARE   @ErrorLine		INT
		, @ErrorProcedure	NVARCHAR(200)
		, @ErrorMessage		NVARCHAR(4000)
		, @ErrorNumber			INT
		, @ErrorSeverity		INT
		, @ErrorState			INT

--First check if this is a new user, but is in fact for a deleted user
DECLARE @count INT = 0
SELECT @count = COUNT([UserID]) FROM [membership].[Users] WITH (NOLOCK) WHERE [UserName] = @UserName and Deleted = 1

IF @count != 0
BEGIN
	SELECT @UserID = [UserID] FROM [membership].[Users] WITH (NOLOCK) WHERE [UserName] = @UserName and Deleted = 1
END


-- // Is this an update of an exsting user or an insert of a new one?
IF EXISTS (SELECT 1 FROM [membership].[Users] WHERE [UserID] = @UserID) BEGIN

	UPDATE	[membership].[Users] WITH (READPAST ROWLOCK)
		SET	[UserName]				= @UserName, 
			[Email]					= @Email, 
			[FirstName]				= @FirstName, 
			[LastName]				= @LastName, 
			[Phone1]				= @Phone1, 
			[Phone2]				= @Phone2, 
			[Language]				= @Language, 
			[TimeZone]				= @TimeZone, 
			[Locked]				= @Locked, 
			[Disabled]				= @Disabled, 
			[ChangePassword]		= @ChangePassword, 
			[Password]				= @Password, 
			[LastPasswordReset]		= @LastPasswordReset, 
			[LastLoginDate]			= @LastLoginDate, 
			[LastLockDate]			= @LastLockDate, 
			[InvalidLogonAttempts]	= @InvalidLogonAttempts, 
			[BrandID]				= @BrandID,
			[EmployeeID]			= @EmployeeID,
			[OutOfOfficeFlg]		= @OutOfOfficeFlg,
			[DelegateUserID]		= @DelegateUserID,
			[UserPreferences]		= @UserPreferences,
			[LastUpdated]			= GETUTCDATE(),
			[UserType]				= @UserType,
			[SendAlertsAsEmail]		= @SendAlertsAsEmail,
			[EscalationUserID]		= @EscalationUserID,
			[PrimaryLocationID]		= @PrimaryLocationID,
			[Deleted]				= 0,
			[Country]				= @Country,
			[Broker]				= @Broker		
		WHERE [UserID] = @UserID

		RETURN 1
	END
ELSE BEGIN	

	------------------------------------------------------------------------------------------------------------------------------------------
	--Added logging to ascertain where issue relating to users losing group membership arises
	DECLARE @logMessage			NVARCHAR(MAX), @logInsertDateTime	DATETIME
	SET @logMessage = 'No user with User ID ' + CAST(@UserID AS VARCHAR(50)) + ' (' + @UserName + ') found. Creating new user'
	SET @logInsertDateTime = GETUTCDATE()
	EXEC [traderiser].[LogInsert] @logInsertDateTime, 'DBServer', 'AdminUserMaintenance', '[membership].UsersUpdate', 8, @logMessage, NULL, NULL
	------------------------------------------------------------------------------------------------------------------------------------------	

	--Must get the WorkspaceLocation and RepoRootLocation
	DECLARE @workspaceID INT, @repoRootID INT, @EveroneGroupID UNIQUEIDENTIFIER, @RestrictPermission UNIQUEIDENTIFIER
	DECLARE @repoRoots TABLE (ID INT, UserCount INT)
	--DECLARE @workSpaces TABLE (ID INT, UserCount INT)

	--INSERT INTO @workSpaces
	--SELECT [WorkspaceID], COUNT(*) AS Usercount FROM [membership].[Users] WITH (NOLOCK) GROUP BY [WorkspaceID]

	--INSERT INTO @workSpaces
	--SELECT Id, 0 FROM [secure].[WorkspaceRootLocations] WHERE Id NOT IN (SELECT ID FROM @workSpaces)

	--SELECT @workspaceID = ID FROM @workSpaces ORDER BY UserCount DESC, ID DESC

	--INSERT INTO @repoRoots
	--SELECT [RepoRootID], COUNT(*) AS Usercount FROM [membership].[Users] WITH (NOLOCK) GROUP BY [RepoRootID]

	--INSERT INTO @repoRoots
	--SELECT Id, 0 FROM [secure].[RepoRootLocations] WHERE Id NOT IN (SELECT ID FROM @repoRoots) AND [Usage] IS NULL

	--SELECT @repoRootID = ID FROM @repoRoots ORDER BY UserCount DESC, ID DESC

	----Get the Everyone Group ID
	--SELECT @EveroneGroupID = [GroupID] FROM [membership].[Groups] WITH (NOLOCK) WHERE [Name] = 'Everyone'
	
	--Now add the User, give them the Incident Type Restriction and add to Everyone group in a transaction
	BEGIN TRY
		BEGIN TRANSACTION
								
			INSERT INTO [membership].[Users] ([UserID], [UserName], [Email], [FirstName], [LastName], [Phone1], [Phone2], [Language], [TimeZone], [Locked], [Disabled], [ChangePassword], [Password], [LastPasswordReset], [CreateDate], [LastLoginDate], [LastLockDate], [InvalidLogonAttempts], [BrandID], [Deleted], [WorkspaceID], [EmployeeID], [OutOfOfficeFlg], [DelegateUserID], [UserPreferences], [LastUpdated], [UserType], [SendAlertsAsEmail], [EscalationUserID], [PrimaryLocationID], [RepoRootID],[Country],[Broker])
			SELECT @UserID, @UserName, @Email, @FirstName, @LastName, @Phone1, @Phone2, @Language, @TimeZone, @Locked, @Disabled, @ChangePassword, @Password, @LastPasswordReset, GETUTCDATE(), @LastLoginDate, @LastLockDate, @InvalidLogonAttempts, @BrandID, 0, @workspaceID, @EmployeeID, @OutOfOfficeFlg, @DelegateUserID, @UserPreferences, GETUTCDATE(), @UserType, @SendAlertsAsEmail, @EscalationUserID, @PrimaryLocationID, @repoRootID,@Country, @Broker

			--Now add to the everyone Group
			--EXEC [membership].[UserUpdateGroupsMembership] @UserID, @EveroneGroupID			

		COMMIT TRANSACTION

		RETURN 1

	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;

		SELECT	  @ErrorLine		= ISNULL(ERROR_LINE (), -1)		 
				, @ErrorProcedure	= ISNULL(ERROR_PROCEDURE(), '-')
				, @ErrorMessage		= ISNULL(ERROR_MESSAGE(), '-')
				, @ErrorNumber = ERROR_NUMBER()
				, @ErrorSeverity = ERROR_SEVERITY()
				, @ErrorState = ERROR_STATE()	

		--Create a Log entry for error
		EXEC [traderiser].[LogExceptionInsert] 'DBServer - UserUpdate', 'UsersUpdate', 4, @ErrorMessage, '[membership].[UsersUpdate]', @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState, @UserID
				
		-- Return empty guid to indicate user creation failed
		SET @UserID = '00000000-0000-0000-0000-000000000000'

		RETURN 0

	END CATCH
END


GO
/****** Object:  StoredProcedure [traderiser].[ConfigurationItemDelete]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [traderiser].[ConfigurationItemDelete]
(
	@IDs	NVARCHAR(MAX)
)

AS

SET NOCOUNT ON;

-- ERROR HANDLING
DECLARE   @ErrorLine			INT
        , @ErrorMessage			NVARCHAR(4000)

BEGIN TRY

    DELETE FROM [traderiser].[ConfigurationItem] 
    WHERE ID IN (SELECT Items FROM [dbo].[ConvertDelimitedStringToTableOfStrings] (@IDs, ','))

    RETURN 1
END TRY

BEGIN CATCH
    SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);

     --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - ConfigurationItem', 'traderiser.ConfigurationItemDelete', 4, @ErrorMessage, '[traderiser].[ConfigurationItemDelete]', @ErrorLine	

    RETURN 0
END CATCH


GO
/****** Object:  StoredProcedure [traderiser].[ConfigurationItemSelect]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [traderiser].[ConfigurationItemSelect] 
AS 

SET NOCOUNT ON 

SELECT	[Name], 
		[DataType], 
		[Value],
		[IsVisible]
  FROM	[traderiser].[ConfigurationItem] WITH (NOLOCK)


GO
/****** Object:  StoredProcedure [traderiser].[ConfigurationItemUpdate]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [traderiser].[ConfigurationItemUpdate] 
(
    @Name		NVARCHAR(100),
    @DataType	NVARCHAR(250),
    @Value		NVARCHAR(MAX),
    @IsVisible	BIT
)

AS 

SET NOCOUNT ON 

-- ERROR HANDLING
DECLARE   @ErrorLine			INT
        , @ErrorMessage			NVARCHAR(4000)
    
BEGIN TRY
    UPDATE	[traderiser].[ConfigurationItem] WITH (READPAST ROWLOCK)
        SET	[DataType]	= @DataType, 
            [Value]		= @Value,
            [IsVisible] = @IsVisible
    WHERE	[Name]		= @Name
    
    IF @@ROWCOUNT = 0
    BEGIN

        INSERT INTO [traderiser].[ConfigurationItem] ([Name], [DataType], [Value], [IsVisible])
        SELECT @Name, @DataType, @Value, @IsVisible
    
    END
    RETURN 1

END TRY

BEGIN CATCH
    SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);

     --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Configuration', 'traderiser.ConfigurationItemUpdate', 4, @ErrorMessage, '[traderiser].[ConfigurationItemUpdate]', @ErrorLine

    RETURN 0
END CATCH


GO
/****** Object:  StoredProcedure [traderiser].[ConnectionStringSelect]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROC [traderiser].[ConnectionStringSelect] 
AS 

SET NOCOUNT ON 

SELECT	[ConnectionName], 
		[ConnectionString],
		[Provider]
  FROM  [traderiser].[ConnectionString] WITH (NOLOCK)

GO
/****** Object:  StoredProcedure [traderiser].[LogExceptionInsert]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


create PROCEDURE [traderiser].[LogExceptionInsert]
	
	@Component		NVARCHAR(50),
	@Sender			NVARCHAR(50),
	@MessageType	TINYINT,
	@Message		NVARCHAR(MAX),
	@ErrorProcedure	NVARCHAR(200),
	@ErrorLine		INT,
	@ErrorNumber	INT = NULL,
	@ErrorSeverity	INT = NULL,
	@ErrorState		INT = NULL,		
	@UserID			UNIQUEIDENTIFIER = NULL,
	@DisplayKey		UNIQUEIDENTIFIER = NULL

AS

SET NOCOUNT ON

-- ERROR HANDLING
DECLARE   
		  @ErrorMessage			NVARCHAR(4000)
		, @LogInsertDateTime	DATETIME
   
BEGIN TRY

	SELECT	 
			@ErrorMessage		=	'Procedure: ' +
									@ErrorProcedure +
									' at line: ' +
									CAST(@ErrorLine as VARCHAR(20)) + '. ' + CHAR(13) +						
									'Message: ' +
									@Message+ '. ' + CHAR(13) +
									CASE WHEN @ErrorNumber IS NOT NULL THEN 'Error Number: ' + CAST(@ErrorNumber as VARCHAR(20)) + '. ' + CHAR(13) ELSE ''  END									
									+
									CASE WHEN @ErrorSeverity IS NOT NULL THEN 'Error Serverity: ' + CAST(@ErrorSeverity as VARCHAR(20)) + '. ' + CHAR(13) ELSE '' END									
									+
									CASE WHEN @ErrorState IS NOT NULL THEN 'Error State: ' + CAST(@ErrorState as VARCHAR(20)) ELSE '' END;				
																			
	SET @LogInsertDateTime = GETUTCDATE()
							
	INSERT INTO [traderiser].[Log] ([InsertDateTime], [MachineName], [Component], [Sender], [MessageType], [Message], [UserID], [DisplayKey])
	VALUES (@LogInsertDateTime, @@SERVERNAME,  @Component, @Sender, @MessageType, @ErrorMessage,@UserID, @DisplayKey);
	
END TRY

BEGIN CATCH

	SET @LogInsertDateTime = GETUTCDATE()

	-- if logging fails do a manual insert in to the log table
	SELECT	  @ErrorNumber		= ERROR_NUMBER()	
			, @ErrorSeverity	= ERROR_SEVERITY()	
			, @ErrorState		= ERROR_STATE()		 
			, @ErrorLine		= ERROR_LINE ()		 
			, @ErrorProcedure	= ISNULL(ERROR_PROCEDURE(), '-')
			, @ErrorMessage		=	'Procedure ' + 
									@ErrorProcedure + 
									' at line ' +
									CAST(@ErrorLine as VARCHAR(20)) + 
									'. Message - ' +
									ERROR_MESSAGE();	

	-- insert in to log table
	INSERT INTO [traderiser].[Log] ([InsertDateTime], [MachineName], [Component], [Sender], [MessageType], [Message], [UserID], [DisplayKey])
	VALUES (@LogInsertDateTime, @@SERVERNAME, 'DB Server ExceptionLogging', 'secure.LogExceptionInsert', 4, @ErrorMessage, NULL, NULL);
	
END CATCH

GO
/****** Object:  StoredProcedure [traderiser].[LogInsert]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [traderiser].[LogInsert]
    @InsertDateTime DATETIME,
    @MachineName	NVARCHAR(50),
    @Component		NVARCHAR(50),
    @Sender			NVARCHAR(50),
    @MessageType	TINYINT,
    @Message		NVARCHAR(MAX),
    @UserID			UNIQUEIDENTIFIER = null,
    @DisplayKey		UNIQUEIDENTIFIER = null
AS

SET NOCOUNT ON

-- ERROR HANDLING
DECLARE   @ErrorLine			INT
        , @ErrorMessage			NVARCHAR(4000)

BEGIN TRY
    INSERT INTO [traderiser].[Log] ([InsertDateTime], [MachineName], [Component], [Sender], [MessageType], [Message], [UserID], [DisplayKey])
    VALUES (@InsertDateTime, @MachineName, @Component, @Sender, @MessageType, @Message, @UserID, @DisplayKey);	

    RETURN 1
END TRY

BEGIN CATCH

SET @ErrorMessage = ISNULL(ERROR_MESSAGE(), '-');	
    SET @ErrorLine = ISNULL(ERROR_LINE (), -1);

     --Create a Log entry for error
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Log', 'traderiser.LogInsert', 4, @ErrorMessage, '[traderiser].[LogInsert]', @ErrorLine

    RETURN 0

END CATCH


GO
/****** Object:  UserDefinedFunction [dbo].[ConvertDelimitedStringToTableOfStrings]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE FUNCTION [dbo].[ConvertDelimitedStringToTableOfStrings]
(
	@String		NVARCHAR(MAX),
	@Delimiter	CHAR(1)
) RETURNS @Results TABLE (Items NVARCHAR(MAX))
AS

BEGIN
      -- convert a delimited array of values into a table of objects (varchar)
      DECLARE @Index INT = 1, @Slice NVARCHAR(MAX)

      If @String IS NULL RETURN
      WHILE @Index != 0
      BEGIN
            SELECT @Index = CHARINDEX(@Delimiter, @String)
            
            IF (@Index != 0)
                  SELECT @Slice = LEFT(@String, @Index - 1)
            ELSE
                  SELECT @Slice = @String
                  
            INSERT INTO @Results(Items) VALUES (@Slice)
            
            SELECT @String = RIGHT(@String, LEN(@String) - @Index)
            
            IF LEN(@String) = 0 BREAK
      END
      RETURN
END


GO
/****** Object:  Table [dbo].[__MigrationHistory]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[__MigrationHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ContextKey] [nvarchar](300) NOT NULL,
	[Model] [varbinary](max) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC,
	[ContextKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](128) NOT NULL,
	[RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](128) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEndDateUtc] [datetime] NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[HistoricQueries]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HistoricQueries](
	[HistoricQueryId] [nvarchar](150) NOT NULL,
	[QueryLogId] [nvarchar](150) NULL,
	[UserId] [nvarchar](128) NULL,
 CONSTRAINT [PK_HistoricQueries] PRIMARY KEY CLUSTERED 
(
	[HistoricQueryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[MembershipProfile]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MembershipProfile](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](max) NULL,
	[FirstName] [nvarchar](128) NOT NULL,
	[LastName] [nvarchar](128) NOT NULL,
	[Phone] [nvarchar](128) NULL,
	[Country] [nvarchar](50) NOT NULL,
	[Broker] [nvarchar](128) NOT NULL,
	[Organisation] [nvarchar](128) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[QueryLog]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QueryLog](
	[QueryLogId] [nvarchar](150) NOT NULL,
	[Query] [nvarchar](max) NULL,
	[Timestamp] [smalldatetime] NULL,
	[Answered] [bit] NULL,
 CONSTRAINT [PK_QueryLog] PRIMARY KEY CLUSTERED 
(
	[QueryLogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TestTable]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TestTable](
	[Muppet] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserProfile]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserProfile](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](56) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserQuerySubscription]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserQuerySubscription](
	[QueryHistoricId] [nvarchar](150) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_UserQuerySubscription] PRIMARY KEY CLUSTERED 
(
	[QueryHistoricId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserSavedQueries]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserSavedQueries](
	[QueryHistoricId] [nvarchar](150) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_UserSavedQueries] PRIMARY KEY CLUSTERED 
(
	[QueryHistoricId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserSession]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserSession](
	[Id] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[CurrentAccessToken] [nvarchar](800) NULL,
	[StartDateTime] [smalldatetime] NULL,
	[EndDateTime] [smalldatetime] NULL,
	[LoggedIn] [bit] NOT NULL,
 CONSTRAINT [PK_dbo.UserSession] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[webpages_Membership]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_Membership](
	[UserId] [int] NOT NULL,
	[CreateDate] [datetime] NULL,
	[ConfirmationToken] [nvarchar](128) NULL,
	[IsConfirmed] [bit] NULL,
	[LastPasswordFailureDate] [datetime] NULL,
	[PasswordFailuresSinceLastSuccess] [int] NOT NULL,
	[Password] [nvarchar](128) NOT NULL,
	[PasswordChangedDate] [datetime] NULL,
	[PasswordSalt] [nvarchar](128) NOT NULL,
	[PasswordVerificationToken] [nvarchar](128) NULL,
	[PasswordVerificationTokenExpirationDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[webpages_OAuthMembership]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_OAuthMembership](
	[Provider] [nvarchar](30) NOT NULL,
	[ProviderUserId] [nvarchar](100) NOT NULL,
	[UserId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Provider] ASC,
	[ProviderUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[webpages_Roles]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](256) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[webpages_UsersInRoles]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_UsersInRoles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [membership].[PasswordHistory]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [membership].[PasswordHistory](
	[UserId] [uniqueidentifier] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[Password] [nvarchar](300) NULL,
 CONSTRAINT [PK_PasswordHistory] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[CreateDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [membership].[Permission]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [membership].[Permission](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[ObjectID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Permission] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Permission_Name_ObjectID] UNIQUE NONCLUSTERED 
(
	[Name] ASC,
	[ObjectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [membership].[Policy]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [membership].[Policy](
	[Container] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Enabled] [bit] NOT NULL,
	[Value] [int] NULL,
 CONSTRAINT [PK_Policy] PRIMARY KEY CLUSTERED 
(
	[Container] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [membership].[UserPasswordReset]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [membership].[UserPasswordReset](
	[UserID] [uniqueidentifier] NOT NULL,
	[ResetToken] [uniqueidentifier] NOT NULL,
	[InsertedDateTime] [datetime] NOT NULL,
 CONSTRAINT [PK_UserPasswordReset] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC,
	[ResetToken] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [membership].[Users]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [membership].[Users](
	[UserID] [uniqueidentifier] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
	[Email] [nvarchar](256) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[Phone1] [nvarchar](30) NULL,
	[Phone2] [nvarchar](30) NULL,
	[Language] [nvarchar](15) NOT NULL,
	[TimeZone] [nvarchar](256) NOT NULL,
	[Locked] [bit] NOT NULL,
	[Disabled] [bit] NOT NULL,
	[ChangePassword] [bit] NOT NULL,
	[Password] [nvarchar](300) NULL,
	[LastPasswordReset] [datetime] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[LastLoginDate] [datetime] NULL,
	[LastLockDate] [datetime] NULL,
	[InvalidLogonAttempts] [smallint] NOT NULL,
	[Photo] [varbinary](max) NULL,
	[BrandID] [uniqueidentifier] NOT NULL,
	[Deleted] [bit] NOT NULL,
	[WorkspaceID] [int] NULL,
	[EmployeeID] [nvarchar](20) NULL,
	[OutOfOfficeFlg] [bit] NOT NULL,
	[DelegateUserID] [uniqueidentifier] NULL,
	[UserPreferences] [nvarchar](max) NULL,
	[LastUpdated] [datetime] NULL,
	[UserType] [varchar](20) NULL,
	[SendAlertsAsEmail] [bit] NOT NULL,
	[EscalationUserID] [uniqueidentifier] NULL,
	[PrimaryLocationID] [varchar](20) NULL,
	[RepoRootID] [int] NULL,
	[Country] [nchar](50) NULL,
	[Broker] [nchar](50) NULL,
 CONSTRAINT [PK__Users] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Users.Users_UserName] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Users_UserName] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [traderiser].[ConfigurationItem]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [traderiser].[ConfigurationItem](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](250) NOT NULL,
	[DataType] [nvarchar](250) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[IsVisible] [bit] NOT NULL,
 CONSTRAINT [PK_ConfigurationItem] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [traderiser].[ConnectionString]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [traderiser].[ConnectionString](
	[ConnectionName] [varchar](100) NOT NULL,
	[ConnectionString] [nvarchar](max) NOT NULL,
	[Provider] [nvarchar](400) NOT NULL,
 CONSTRAINT [PK_ConnectionString] PRIMARY KEY CLUSTERED 
(
	[ConnectionName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [traderiser].[Log]    Script Date: 15/06/2016 23:05:57 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [traderiser].[Log](
	[InsertDateTime] [datetime] NOT NULL,
	[LogID] [bigint] IDENTITY(1,1) NOT NULL,
	[MachineName] [nvarchar](50) NOT NULL,
	[Component] [nvarchar](50) NOT NULL,
	[Sender] [nvarchar](50) NOT NULL,
	[MessageType] [tinyint] NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[UserID] [uniqueidentifier] NULL,
	[DisplayKey] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Log] PRIMARY KEY CLUSTERED 
(
	[InsertDateTime] ASC,
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
ALTER TABLE [dbo].[webpages_Membership] ADD  DEFAULT ((0)) FOR [IsConfirmed]
GO
ALTER TABLE [dbo].[webpages_Membership] ADD  DEFAULT ((0)) FOR [PasswordFailuresSinceLastSuccess]
GO
ALTER TABLE [membership].[Policy] ADD  DEFAULT ((1)) FOR [Enabled]
GO
ALTER TABLE [membership].[Users] ADD  DEFAULT ((0)) FOR [Locked]
GO
ALTER TABLE [membership].[Users] ADD  DEFAULT ((0)) FOR [Disabled]
GO
ALTER TABLE [membership].[Users] ADD  DEFAULT ((0)) FOR [ChangePassword]
GO
ALTER TABLE [membership].[Users] ADD  DEFAULT ((0)) FOR [Deleted]
GO
ALTER TABLE [membership].[Users] ADD  DEFAULT ((0)) FOR [OutOfOfficeFlg]
GO
ALTER TABLE [membership].[Users] ADD  DEFAULT ((0)) FOR [SendAlertsAsEmail]
GO
ALTER TABLE [traderiser].[ConfigurationItem] ADD  DEFAULT ((1)) FOR [IsVisible]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[webpages_UsersInRoles]  WITH CHECK ADD  CONSTRAINT [fk_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[webpages_Roles] ([RoleId])
GO
ALTER TABLE [dbo].[webpages_UsersInRoles] CHECK CONSTRAINT [fk_RoleId]
GO
ALTER TABLE [dbo].[webpages_UsersInRoles]  WITH CHECK ADD  CONSTRAINT [fk_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserProfile] ([UserId])
GO
ALTER TABLE [dbo].[webpages_UsersInRoles] CHECK CONSTRAINT [fk_UserId]
GO
ALTER TABLE [membership].[UserPasswordReset]  WITH CHECK ADD  CONSTRAINT [FK_UserPasswordReset_UserID] FOREIGN KEY([UserID])
REFERENCES [membership].[Users] ([UserID])
GO
ALTER TABLE [membership].[UserPasswordReset] CHECK CONSTRAINT [FK_UserPasswordReset_UserID]
GO
USE [master]
GO
ALTER DATABASE [TRUserManagement] SET  READ_WRITE 
GO
