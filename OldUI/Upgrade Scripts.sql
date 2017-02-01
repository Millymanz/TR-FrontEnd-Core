USE [TRUserManagement]
GO
/******  INSERTS */
INSERT INTO traderiser.ConfigurationItem (Name,DataType,Value,IsVisible)
  VALUES ('Core.EmailInfoAddress','Text','info@mydomain.com','1') 

GO
CREATE TABLE [traderiser].[Feedback](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[Email] [nvarchar](256) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[Message] [nvarchar](max) NULL,
	[Actioned] [bit] NOT NULL,
	[InsertDateTime] [datetime] NOT NULL,
 CONSTRAINT [PK_Feedback] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[traderiser].[FeedbacksUpdate]') AND type in (N'P')) 
DROP PROCEDURE [traderiser].[FeedbacksUpdate]
GO

CREATE PROC [traderiser].[FeedbacksUpdate]
(
	@ID					BIGINT,
    @Name				NVARCHAR(256),
    @Email				NVARCHAR(256),
    @FirstName			NVARCHAR(100) = NULL, 
    @LastName			NVARCHAR(100)  = NULL,
    @Message			NVARCHAR(MAX) = NULL,     
	@Actioned			BIT = 0,
	@InsertDateTime		DATETIME = NULL	
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

IF EXISTS (SELECT 1 FROM [traderiser].[Feedback] WHERE ID = @ID) BEGIN

		UPDATE [traderiser].[Feedback]
		   SET [Name] = @Name
			  ,[Email] = @Email
			  ,[FirstName] = @FirstName
			  ,[LastName] = @LastName
			  ,[Message] = @Message
			  ,[Actioned] = @Actioned
			--  ,[InsertDateTime] = @InsertDateTime
				WHERE ID = @ID

		RETURN 1
	END
ELSE BEGIN	
	BEGIN TRY
		BEGIN TRANSACTION
								
			INSERT INTO [traderiser].[Feedback]
           ([Name]
           ,[Email]
           ,[FirstName]
           ,[LastName]
           ,[Message]
           ,[Actioned]
           ,[InsertDateTime])
     VALUES
		   (@Name				
		   ,@Email				
		   ,coalesce(@FirstName, '')			
		   ,coalesce(@LastName, '')		
		   ,coalesce(@Message, '')			
		   ,@Actioned			
		   ,getdate())	

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
		EXEC [traderiser].[LogExceptionInsert] 'DBServer - FeedbacksUpdate', 'FeedbacksUpdate', 4, @ErrorMessage, '[traderiser].[FeedbacksUpdate]', @ErrorLine, @ErrorNumber, @ErrorSeverity, @ErrorState				
	
		RETURN 0

	END CATCH
END


GO

ALTER PROCEDURE traderiser.LogInsert
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
    EXEC [traderiser].[LogExceptionInsert] 'DBServer - Log', 'traderiser.LogInsert', 4, @ErrorMessage, 'traderiser.LogInsert', @ErrorLine

    RETURN 0

END CATCH