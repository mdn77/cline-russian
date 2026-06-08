import { UpdateTerminalConnectionTimeoutResponse } from "@shared/proto/index.cline"
import { VSCodeCheckbox, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import React, { useState } from "react"
import { PlatformType } from "@/config/platform.config"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { usePlatform } from "@/context/PlatformContext"
import { StateServiceClient } from "../../../services/grpc-client"
import Section from "../Section"
import TerminalOutputLineLimitSlider from "../TerminalOutputLineLimitSlider"
import { updateSetting } from "../utils/settingsHandlers"

interface TerminalSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

export const TerminalSettingsSection: React.FC<TerminalSettingsSectionProps> = ({ renderSectionHeader }) => {
	const {
		shellIntegrationTimeout,
		terminalReuseEnabled,
		defaultTerminalProfile,
		availableTerminalProfiles,
		vscodeTerminalExecutionMode,
	} = useExtensionState()
	const platformConfig = usePlatform()
	const isVsCodePlatform = platformConfig.type === PlatformType.VSCODE

	const [inputValue, setInputValue] = useState((shellIntegrationTimeout / 1000).toString())
	const [inputError, setInputError] = useState<string | null>(null)

	const handleTimeoutChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		const value = target.value

		setInputValue(value)

		const seconds = parseFloat(value)
		if (Number.isNaN(seconds) || seconds <= 0) {
			setInputError("Please enter a positive number")
			return
		}

		setInputError(null)
		const timeoutMs = Math.round(seconds * 1000)

		StateServiceClient.updateTerminalConnectionTimeout({ timeoutMs })
			.then((response: UpdateTerminalConnectionTimeoutResponse) => {
				const timeoutMs = response.timeoutMs
				// Backend calls postStateToWebview(), so state will update via subscription
				// Just sync the input value with the confirmed backend value
				if (timeoutMs !== undefined) {
					setInputValue((timeoutMs / 1000).toString())
				}
			})
			.catch((error) => {
				console.error("Failed to update terminal connection timeout:", error)
			})
	}

	const handleInputBlur = () => {
		if (inputError) {
			setInputValue((shellIntegrationTimeout / 1000).toString())
			setInputError(null)
		}
	}

	const handleTerminalReuseChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		const checked = target.checked
		updateSetting("terminalReuseEnabled", checked)
	}

	const handleExecutionModeChange = (event: Event) => {
		const target = event.target as HTMLSelectElement
		const value = target.value === "backgroundExec" ? "backgroundExec" : "vscodeTerminal"
		updateSetting("vscodeTerminalExecutionMode", value)
	}

	// Use any to avoid type conflicts between Event and FormEvent
	const handleDefaultTerminalProfileChange = (event: any) => {
		const target = event.target as HTMLSelectElement
		const profileId = target.value

		// Save immediately using the consolidated updateSettings approach
		updateSetting("defaultTerminalProfile", profileId || "default")
	}

	const profilesToShow = availableTerminalProfiles

	return (
		<div>
			{renderSectionHeader("terminal")}
			<Section>
				<div className="mb-5" id="terminal-settings-section">
					<div className="mb-4">
						<label className="font-medium block mb-1" htmlFor="default-terminal-profile">
							Профиль терминала по умолчанию (Default Profile)
						</label>
						<VSCodeDropdown
							className="w-full"
							id="default-terminal-profile"
							onChange={handleDefaultTerminalProfileChange}
							value={defaultTerminalProfile || "default"}>
							{profilesToShow.map((profile) => (
								<VSCodeOption key={profile.id} title={profile.description} value={profile.id}>
									{profile.name}
								</VSCodeOption>
							))}
						</VSCodeDropdown>
						<p className="text-xs text-(--vscode-descriptionForeground) mt-1">
							Выберите терминал по умолчанию, который будет использовать Cline. 'Default' использует глобальные настройки VS Code.
						</p>
					</div>

					<div className="mb-4">
						<div className="mb-2">
							<label className="font-medium block mb-1">Таймаут интеграции оболочки (в секундах)</label>
							<div className="flex items-center">
								<VSCodeTextField
									className="w-full"
									onBlur={handleInputBlur}
									onChange={(event) => handleTimeoutChange(event as Event)}
									placeholder="Введите таймаут в секундах"
									value={inputValue}
								/>
							</div>
							{inputError && <div className="text-(--vscode-errorForeground) text-xs mt-1">{inputError}</div>}
						</div>
						<p className="text-xs text-(--vscode-descriptionForeground)">
							Время ожидания активации интеграции оболочки (в секундах). Увеличьте это значение, если у вас зависают команды терминала на старте.
						</p>
					</div>

					<div className="mb-4">
						<div className="flex items-center mb-2">
							<VSCodeCheckbox
								checked={terminalReuseEnabled ?? true}
								onChange={(event) => handleTerminalReuseChange(event as Event)}>
								Агрессивное повторное использование терминала
							</VSCodeCheckbox>
						</div>
						<p className="text-xs text-(--vscode-descriptionForeground)">
							Если включено, Cline будет повторно использовать открытые терминалы, которые не находятся в текущей рабочей папке. Отключите, если задачи блокируются после выполнения команд.
						</p>
					</div>
					{isVsCodePlatform && (
						<div className="mb-4">
							<label className="font-medium block mb-1" htmlFor="terminal-execution-mode">
								Режим выполнения терминала
							</label>
							<VSCodeDropdown
								className="w-full"
								id="terminal-execution-mode"
								onChange={(event) => handleExecutionModeChange(event as Event)}
								value={vscodeTerminalExecutionMode ?? "vscodeTerminal"}>
								<VSCodeOption value="vscodeTerminal">Терминал VS Code</VSCodeOption>
								<VSCodeOption value="backgroundExec">Фоновый процесс (Background Exec)</VSCodeOption>
							</VSCodeDropdown>
							<p className="text-xs text-[var(--vscode-descriptionForeground)] mt-1">
								Выберите способ запуска команд: в активном терминале VS Code или в фоновом процессе.
							</p>
						</div>
					)}
					<TerminalOutputLineLimitSlider />
					<div className="mt-5 p-3 bg-(--vscode-textBlockQuote-background) rounded border border-(--vscode-textBlockQuote-border)">
						<p className="text-[13px] m-0">
							<strong>Проблемы с терминалом?</strong> Обратитесь к разделу{" "}
							<a
								className="text-(--vscode-textLink-foreground) underline hover:no-underline"
								href="https://docs.cline.bot/troubleshooting/terminal-quick-fixes"
								rel="noopener noreferrer"
								target="_blank">
								Быстрые исправления терминала
							</a>{" "}
							или{" "}
							<a
								className="text-(--vscode-textLink-foreground) underline hover:no-underline"
								href="https://docs.cline.bot/troubleshooting/terminal-integration-guide"
								rel="noopener noreferrer"
								target="_blank">
								Полному руководству по устранению неполадок
							</a>
							.
						</p>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default TerminalSettingsSection
