import { Mode } from "@shared/storage/types"
import { VSCodeDropdown, VSCodeOption, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { ApiKeyField } from "../common/ApiKeyField"
import { DebouncedTextField } from "../common/DebouncedTextField"
import { ModelInfoView } from "../common/ModelInfoView"
import { getModeSpecificFields, normalizeApiConfiguration } from "../utils/providerUtils"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"
import { parsePrice } from "../utils/pricingUtils"
import { getAsVar, VSC_DESCRIPTION_FOREGROUND } from "@/utils/vscStyles"
import { openAiModelInfoSaneDefaults } from "@shared/api"

interface NineRouterProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

const PRESETS = [
	{ value: "http://localhost:20128/v1", label: "9router Local (http://localhost:20128/v1)", defaultModel: "free-mix" },
	{ value: "https://routerai.ru/api/v1", label: "RouterAI Cloud (https://routerai.ru/api/v1)", defaultModel: "deepseek/deepseek-v4-flash" },
	{ value: "custom", label: "Пользовательский URL...", defaultModel: "free-mix" },
]

export const NineRouterProvider = ({ showModelOptions, isPopup, currentMode }: NineRouterProviderProps) => {
	const { apiConfiguration } = useExtensionState()
	const { handleFieldChange, handleModeFieldChange } = useApiConfigurationHandlers()
	const [modelConfigurationSelected, setModelConfigurationSelected] = useState(false)

	const currentBaseUrl = apiConfiguration?.nineRouterBaseUrl || "http://localhost:20128/v1"
	
	// Determine dropdown selection
	const presetSelection = useMemo(() => {
		const found = PRESETS.find(p => p.value === currentBaseUrl)
		return found ? found.value : "custom"
	}, [currentBaseUrl])

	const [customUrl, setCustomUrl] = useState(() => {
		const found = PRESETS.find(p => p.value === currentBaseUrl)
		return found ? "" : currentBaseUrl
	})

	// Get mode-specific fields
	const modeFields = getModeSpecificFields(apiConfiguration, currentMode)
	const selectedModelId = modeFields.nineRouterModelId || "free-mix"
	const nineRouterModelInfo = modeFields.nineRouterModelInfo || { ...openAiModelInfoSaneDefaults }

	const handlePresetChange = (e: any) => {
		const val = e.target.value
		if (val === "custom") {
			handleFieldChange("nineRouterBaseUrl", customUrl || "http://localhost:20128/v1")
		} else {
			handleFieldChange("nineRouterBaseUrl", val)
			// Auto-suggest default model for the selected preset
			const preset = PRESETS.find(p => p.value === val)
			if (preset && preset.defaultModel) {
				handleModeFieldChange(
					{ plan: "planModeNineRouterModelId", act: "actModeNineRouterModelId" },
					preset.defaultModel,
					currentMode,
				)
			}
		}
	}

	const handleCustomUrlChange = (val: string) => {
		setCustomUrl(val)
		handleFieldChange("nineRouterBaseUrl", val)
	}

	return (
		<div>
			<div className="mb-2.5">
				<label className="block mb-1 text-base font-medium">Базовый URL (Base URL)</label>
				<VSCodeDropdown
					currentValue={presetSelection}
					onChange={handlePresetChange}
					style={{ width: "100%", marginBottom: presetSelection === "custom" ? 8 : 12 }}>
					{PRESETS.map((p) => (
						<VSCodeOption key={p.value} value={p.value}>
							{p.label}
						</VSCodeOption>
					))}
				</VSCodeDropdown>

				{presetSelection === "custom" && (
					<DebouncedTextField
						initialValue={customUrl}
						onChange={handleCustomUrlChange}
						placeholder="http://localhost:20128/v1"
						style={{ width: "100%", marginBottom: 12 }}
					/>
				)}
			</div>

			<ApiKeyField
				initialValue={apiConfiguration?.nineRouterApiKey || ""}
				onChange={(value) => handleFieldChange("nineRouterApiKey", value)}
				providerName="9router"
			/>

			<div className="mb-2.5">
				<DebouncedTextField
					initialValue={selectedModelId}
					onChange={(value) =>
						handleModeFieldChange(
							{ plan: "planModeNineRouterModelId", act: "actModeNineRouterModelId" },
							value || "free-mix",
							currentMode,
						)
					}
					placeholder="free-mix"
					style={{ width: "100%", marginBottom: 10 }}>
					<span style={{ fontWeight: 500 }}>ID модели (Model ID)</span>
				</DebouncedTextField>
			</div>

			<div
				onClick={() => setModelConfigurationSelected((val) => !val)}
				style={{
					color: getAsVar(VSC_DESCRIPTION_FOREGROUND),
					display: "flex",
					margin: "10px 0",
					cursor: "pointer",
					alignItems: "center",
				}}>
				<span
					className={`codicon ${modelConfigurationSelected ? "codicon-chevron-down" : "codicon-chevron-right"}`}
					style={{
						marginRight: "4px",
					}}
				/>
				<span
					style={{
						fontWeight: 700,
						textTransform: "uppercase",
					}}>
					Настройка модели (Model Configuration)
				</span>
			</div>

			{modelConfigurationSelected && (
				<>
					<VSCodeCheckbox
						checked={!!nineRouterModelInfo?.supportsImages}
						onChange={(e: any) => {
							const isChecked = e.target.checked === true
							const modelInfo = { ...nineRouterModelInfo }
							modelInfo.supportsImages = isChecked
							handleModeFieldChange(
								{ plan: "planModeNineRouterModelInfo", act: "actModeNineRouterModelInfo" },
								modelInfo,
								currentMode,
							)
						}}>
						Поддержка изображений (Supports Images)
					</VSCodeCheckbox>

					<div style={{ display: "flex", gap: 10, marginTop: "5px" }}>
						<DebouncedTextField
							initialValue={
								nineRouterModelInfo?.contextWindow
									? nineRouterModelInfo.contextWindow.toString()
									: (openAiModelInfoSaneDefaults.contextWindow?.toString() ?? "")
							}
							onChange={(value) => {
								const modelInfo = { ...nineRouterModelInfo }
								modelInfo.contextWindow = Number(value)
								handleModeFieldChange(
									{ plan: "planModeNineRouterModelInfo", act: "actModeNineRouterModelInfo" },
									modelInfo,
									currentMode,
								)
							}}
							style={{ flex: 1 }}>
							<span style={{ fontWeight: 500 }}>Размер окна контекста</span>
						</DebouncedTextField>

						<DebouncedTextField
							initialValue={
								nineRouterModelInfo?.maxTokens
									? nineRouterModelInfo.maxTokens.toString()
									: (openAiModelInfoSaneDefaults.maxTokens?.toString() ?? "")
							}
							onChange={(value) => {
								const modelInfo = { ...nineRouterModelInfo }
								modelInfo.maxTokens = Number(value)
								handleModeFieldChange(
									{ plan: "planModeNineRouterModelInfo", act: "actModeNineRouterModelInfo" },
									modelInfo,
									currentMode,
								)
							}}
							style={{ flex: 1 }}>
							<span style={{ fontWeight: 500 }}>Макс. выходных токенов</span>
						</DebouncedTextField>
					</div>

					<div style={{ display: "flex", gap: 10, marginTop: "5px" }}>
						<DebouncedTextField
							initialValue={
								nineRouterModelInfo?.inputPrice
									? nineRouterModelInfo.inputPrice.toString()
									: (openAiModelInfoSaneDefaults.inputPrice?.toString() ?? "")
							}
							onChange={(value) => {
								const modelInfo = { ...nineRouterModelInfo }
								modelInfo.inputPrice = parsePrice(value, openAiModelInfoSaneDefaults.inputPrice ?? 0)
								handleModeFieldChange(
									{ plan: "planModeNineRouterModelInfo", act: "actModeNineRouterModelInfo" },
									modelInfo,
									currentMode,
								)
							}}
							style={{ flex: 1 }}>
							<span style={{ fontWeight: 500 }}>Цена за ввод / 1 млн токенов</span>
						</DebouncedTextField>

						<DebouncedTextField
							initialValue={
								nineRouterModelInfo?.outputPrice
									? nineRouterModelInfo.outputPrice.toString()
									: (openAiModelInfoSaneDefaults.outputPrice?.toString() ?? "")
							}
							onChange={(value) => {
								const modelInfo = { ...nineRouterModelInfo }
								modelInfo.outputPrice = parsePrice(value, openAiModelInfoSaneDefaults.outputPrice ?? 0)
								handleModeFieldChange(
									{ plan: "planModeNineRouterModelInfo", act: "actModeNineRouterModelInfo" },
									modelInfo,
									currentMode,
								)
							}}
							style={{ flex: 1 }}>
							<span style={{ fontWeight: 500 }}>Цена за вывод / 1 млн токенов</span>
						</DebouncedTextField>
					</div>
				</>
			)}

			{showModelOptions && (
				<ModelInfoView
					isPopup={isPopup}
					modelInfo={nineRouterModelInfo}
					selectedModelId={selectedModelId}
				/>
			)}
		</div>
	)
}

export default NineRouterProvider
