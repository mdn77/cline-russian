export enum NEW_USER_TYPE {
	FREE = "free",
	POWER = "power",
	BYOK = "byok",
}

type UserTypeSelection = {
	title: string
	description: string
	type: NEW_USER_TYPE
}

export const STEP_CONFIG = {
	0: {
		title: "Как вы планируете использовать Cline?",
		description: "Выберите вариант ниже, чтобы начать.",
		buttons: [
			{ text: "Продолжить", action: "next", variant: "default" },
			{ text: "Войти в аккаунт Cline", action: "signin", variant: "secondary" },
		],
	},
	[NEW_USER_TYPE.FREE]: {
		title: "Выберите бесплатную модель",
		buttons: [
			{ text: "Создать аккаунт", action: "signup", variant: "default" },
			{ text: "Назад", action: "back", variant: "secondary" },
		],
	},
	[NEW_USER_TYPE.POWER]: {
		title: "Выберите вашу модель",
		buttons: [
			{ text: "Создать аккаунт", action: "signup", variant: "default" },
			{ text: "Назад", action: "back", variant: "secondary" },
		],
	},
	[NEW_USER_TYPE.BYOK]: {
		title: "Настройте вашего провайдера",
		buttons: [
			{ text: "Продолжить", action: "done", variant: "default" },
			{ text: "Назад", action: "back", variant: "secondary" },
		],
	},
	2: {
		title: "Почти готово!",
		description: "Завершите создание аккаунта в вашем браузере, затем вернитесь сюда для продолжения.",
		buttons: [{ text: "Назад", action: "back", variant: "secondary" }],
	},
} as const

export const USER_TYPE_SELECTIONS: UserTypeSelection[] = [
	{ title: "Совершенно бесплатно", description: "Начните без каких-либо затрат (требуется карта для верификации)", type: NEW_USER_TYPE.FREE },
	{ title: "Передовые модели по подписке", description: "Доступ к Claude 3.5 Sonnet, GPT-4o, Gemini Pro и др.", type: NEW_USER_TYPE.POWER },
	{ title: "Использовать свой API-ключ (Без авторизации)", description: "Полностью локально и бесплатно: введите свой ключ OpenRouter, Anthropic, Gemini, OpenAI и др.", type: NEW_USER_TYPE.BYOK },
]
