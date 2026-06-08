import { ActionMetadata } from "./types"

export const ACTION_METADATA: ActionMetadata[] = [
	{
		id: "readFiles",
		label: "Читать файлы проекта",
		shortName: "Чтение",
		icon: "codicon-search",
		subAction: {
			id: "readFilesExternally",
			label: "Читать все файлы",
			shortName: "Чтение (все)",
			icon: "codicon-folder-opened",
			parentActionId: "readFiles",
		},
	},
	{
		id: "editFiles",
		label: "Редактировать файлы проекта",
		shortName: "Правка",
		icon: "codicon-edit",
		subAction: {
			id: "editFilesExternally",
			label: "Редактировать все файлы",
			shortName: "Правка (все)",
			icon: "codicon-files",
			parentActionId: "editFiles",
		},
	},
	{
		id: "executeSafeCommands",
		label: "Выполнять безопасные команды",
		shortName: "Безопасные",
		icon: "codicon-terminal",
		subAction: {
			id: "executeAllCommands",
			label: "Выполнять все команды",
			shortName: "Все команды",
			icon: "codicon-terminal-bash",
			parentActionId: "executeSafeCommands",
		},
	},
	{
		id: "useBrowser",
		label: "Использовать браузер",
		shortName: "Браузер",
		icon: "codicon-globe",
	},
	{
		id: "useMcp",
		label: "Использовать MCP серверы",
		shortName: "MCP",
		icon: "codicon-server",
	},
]

export const NOTIFICATIONS_SETTING: ActionMetadata = {
	id: "enableNotifications",
	label: "Включить уведомления",
	shortName: "Уведомления",
	icon: "codicon-bell",
}
