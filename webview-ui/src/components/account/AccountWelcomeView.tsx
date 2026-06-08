import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { useClineSignIn } from "@/context/ClineAuthContext"
import { useExtensionState } from "@/context/ExtensionStateContext"
import ClineLogoVariable from "../../assets/ClineLogoVariable"

// export const AccountWelcomeView = () => (
// 	<div className="flex flex-col items-center pr-3 gap-2.5">
// 		<ClineLogoWhite className="size-16 mb-4" />
export const AccountWelcomeView = () => {
	const { environment } = useExtensionState()
	const { isLoginLoading, handleSignIn } = useClineSignIn()

	return (
		<div className="flex flex-col items-center gap-2.5">
			<ClineLogoVariable className="size-16 mb-4" environment={environment} />

			<p>
				Зарегистрируйтесь, чтобы получить доступ к новейшим моделям, панели управления счетами для просмотра использования и кредитов, а также к другим будущим функциям.
			</p>

			<VSCodeButton className="w-full mb-4" disabled={isLoginLoading} onClick={handleSignIn}>
				Зарегистрироваться в Cline
				{isLoginLoading && (
					<span className="ml-1 animate-spin">
						<span className="codicon codicon-refresh"></span>
					</span>
				)}
			</VSCodeButton>

			<p className="text-(--vscode-descriptionForeground) text-xs text-center m-0">
				Продолжая, вы соглашаетесь с <VSCodeLink href="https://cline.bot/tos">Условиями использования</VSCodeLink> и{" "}
				<VSCodeLink href="https://cline.bot/privacy">Политикой конфиденциальности.</VSCodeLink>
			</p>
		</div>
	)
}
