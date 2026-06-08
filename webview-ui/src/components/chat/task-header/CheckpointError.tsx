import { useMemo } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface CheckpointErrorProps {
	checkpointManagerErrorMessage?: string
	handleCheckpointSettingsClick: () => void
}
export const CheckpointError: React.FC<CheckpointErrorProps> = ({
	checkpointManagerErrorMessage,
	handleCheckpointSettingsClick,
}) => {
	const messages = useMemo(() => {
		const message = checkpointManagerErrorMessage?.replace(/отключения чекпоинтов\.$/, "")
		const showDisableButton =
			checkpointManagerErrorMessage?.endsWith("отключения чекпоинтов.") ||
			checkpointManagerErrorMessage?.includes("мульти-корневые рабочие пространства")
		const showGitInstructions = checkpointManagerErrorMessage?.includes("Git должен быть установлен для использования чекпоинтов.")
		return { message, showDisableButton, showGitInstructions }
	}, [checkpointManagerErrorMessage])

	if (!checkpointManagerErrorMessage) {
		return null
	}

	return (
		<div className="flex items-center justify-center w-full">
			<Alert title={messages.message} variant="danger">
				<AlertDescription className="flex gap-2 justify-end">
					{messages.showDisableButton && (
						<Button aria-label="Отключить чекпоинты" onClick={handleCheckpointSettingsClick} variant="ghost">
							Отключить чекпоинты
						</Button>
					)}
					{messages.showGitInstructions && (
						<a
							className="text-link underline"
							href="https://github.com/cline/cline/wiki/Installing-Git-for-Checkpoints">
							Инструкция
						</a>
					)}
				</AlertDescription>
			</Alert>
		</div>
	)
}
