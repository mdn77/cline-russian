import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import Section from "../Section"

interface AboutSectionProps {
	version: string
	renderSectionHeader: (tabId: string) => JSX.Element | null
}
const AboutSection = ({ version, renderSectionHeader }: AboutSectionProps) => {
	return (
		<div>
			{renderSectionHeader("about")}
			<Section>
				<div className="flex px-4 flex-col gap-2">
					<h2 className="text-lg font-semibold">Cline v{version}</h2>
					<p>
						ИИ-ассистент, который может использовать ваш терминал и редактор. Cline может пошагово решать сложные задачи веб-разработки и программирования с помощью инструментов для создания и изменения файлов, исследования больших проектов, работы с браузером и выполнения консольных команд (после вашего подтверждения).
					</p>

					<h3 className="text-md font-semibold">Сообщество и поддержка</h3>
					<p>
						<VSCodeLink href="https://x.com/cline">X</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://discord.gg/cline">Discord</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://www.reddit.com/r/cline/"> r/cline</VSCodeLink>
					</p>

					<h3 className="text-md font-semibold">Разработка</h3>
					<p>
						<VSCodeLink href="https://github.com/cline/cline">GitHub</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://github.com/cline/cline/issues"> Issues</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://github.com/cline/cline/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop">
							{" "}
							Запросы функций
						</VSCodeLink>
					</p>

					<h3 className="text-md font-semibold">Ресурсы</h3>
					<p>
						<VSCodeLink href="https://docs.cline.bot/">Документация</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://cline.bot/">https://cline.bot</VSCodeLink>
					</p>
				</div>
			</Section>
		</div>
	)
}

export default AboutSection
