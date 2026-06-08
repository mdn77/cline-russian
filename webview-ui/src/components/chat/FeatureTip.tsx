import { LightbulbIcon } from "lucide-react"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FeatureTipItem {
	text: string
}

const FEATURE_TIPS: FeatureTipItem[] = [
	{
		text: 'Включите "Double-Check Completion" в настройках, чтобы Cline проверял свою работу перед завершением задачи.',
	},
	{
		text: "Добавьте файл .clinerules в корень проекта, чтобы дать Cline инструкции, специфичные для проекта.",
	},
	{
		text: "Переключитесь в Plan Mode, чтобы обсудить и спланировать подход, прежде чем Cline начнёт действовать.",
	},
	{
		text: "Используйте @ в поле ввода чата, чтобы добавить файлы, папки или URL-адреса в контекст задачи.",
	},
	{
		text: "Настройте MCP-серверы, чтобы предоставить Cline доступ к внешним инструментам и API.",
	},
	{
		text: "Cline создаёт контрольные точки после изменений — вы всегда можете вернуться к предыдущему состоянию.",
	},
	{
		text: "Используйте /compact, чтобы сократить длинные диалоги и освободить место в окне контекста.",
	},
	{
		text: "Включите автоподтверждение для инструментов только для чтения, например чтения файлов, чтобы ускорить исследование.",
	},
	{
		text: "Используйте кнопку цитирования, чтобы выбрать текст из ответа Cline и сослаться на него в своём ответе.",
	},
	{
		text: "Вы можете перетаскивать изображения в чат, чтобы делиться скриншотами с Cline.",
	},
	{
		text: "Cline может просматривать веб-сайты — попросите его протестировать ваш локальный сервер разработки в браузере.",
	},
	{
		text: "Используйте /reportbug, чтобы быстро создать issue на GitHub с включённым диагностическим контекстом.",
	},
	{
		text: 'Вы можете отключить эти подсказки в Settings → Features → "Feature Tips".',
	},
]

const SHOW_DELAY_MS = 2000
const CYCLE_INTERVAL_MS = 8000
const FADE_DURATION_MS = 300

/**
 * Shows rotating feature tips below the "Thinking..." indicator.
 * Appears after a brief delay and cycles through tips while Cline is thinking.
 */
export const FeatureTip = memo(() => {
	const [isVisible, setIsVisible] = useState(false)
	const [hasFadedIn, setHasFadedIn] = useState(false)
	const [isFading, setIsFading] = useState(false)
	const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * FEATURE_TIPS.length))
	const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const currentTip = FEATURE_TIPS[tipIndex]

	const advanceTip = useCallback(() => {
		setIsFading(true)
		fadeTimerRef.current = setTimeout(() => {
			setTipIndex((prev) => (prev + 1) % FEATURE_TIPS.length)
			setIsFading(false)
		}, FADE_DURATION_MS)
	}, [])

	useEffect(() => {
		showTimerRef.current = setTimeout(() => {
			setIsVisible(true)
			// Trigger fade-in on next frame so transition applies
			requestAnimationFrame(() => setHasFadedIn(true))
			cycleTimerRef.current = setInterval(advanceTip, CYCLE_INTERVAL_MS)
		}, SHOW_DELAY_MS)

		return () => {
			if (showTimerRef.current) {
				clearTimeout(showTimerRef.current)
			}
			if (cycleTimerRef.current) {
				clearInterval(cycleTimerRef.current)
			}
			if (fadeTimerRef.current) {
				clearTimeout(fadeTimerRef.current)
			}
		}
	}, [advanceTip])

	if (!isVisible) {
		return null
	}

	return (
		<div
			className={cn(
				"flex items-start gap-1.5 mt-2 ml-1 transition-opacity duration-300",
				!hasFadedIn || isFading ? "opacity-0" : "opacity-100",
			)}>
			<LightbulbIcon className="size-3 text-description shrink-0 mt-[1px]" />
			<span className="text-xs text-description leading-relaxed">
				<span className="font-medium">Совет:</span> {currentTip.text}
			</span>
		</div>
	)
})

FeatureTip.displayName = "FeatureTip"
