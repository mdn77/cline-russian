export interface QuickWinTask {
	id: string
	title: string
	description: string
	icon?: string
	actionCommand: string
	prompt: string
	buttonText?: string
}

export const quickWinTasks: QuickWinTask[] = [
	{
		id: "nextjs_notetaking_app",
		title: "Создать Next.js приложение",
		description: "Создайте красивое приложение для заметок с Next.js и Tailwind",
		icon: "WebAppIcon",
		actionCommand: "cline/createNextJsApp",
		prompt: "Создай красивое приложение для заметок на Next.js, используя Tailwind CSS для стилизации. Настрой базовую структуру и простой интерфейс для добавления и просмотра заметок.",
		buttonText: ">",
	},
	{
		id: "terminal_cli_tool",
		title: "Создать CLI инструмент",
		description: "Разработайте мощный терминальный CLI для автоматизации задач",
		icon: "TerminalIcon",
		actionCommand: "cline/createCliTool",
		prompt: "Создай CLI-инструмент на Node.js для организации файлов в директории по типу, размеру или дате. Добавь опции сортировки по папкам, отображения статистики, поиска дубликатов и очистки пустых директорий. Используй цветной вывод и индикаторы прогресса.",
		buttonText: ">",
	},
	{
		id: "snake_game",
		title: "Создать игру",
		description: "Создайте классическую игру Snake в браузере",
		icon: "GameIcon",
		actionCommand: "cline/createSnakeGame",
		prompt: "Создай классическую игру Snake на HTML, CSS и JavaScript. Игра должна быть доступна в браузере, с управлением змейкой с клавиатуры, системой подсчёта очков и состоянием окончания игры.",
		buttonText: ">",
	},
]