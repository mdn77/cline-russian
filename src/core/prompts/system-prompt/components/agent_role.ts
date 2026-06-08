import { SystemPromptSection } from "../templates/placeholders"
import { TemplateEngine } from "../templates/TemplateEngine"
import type { PromptVariant, SystemPromptContext } from "../types"

const getAgentRoleText = (context: SystemPromptContext) => {
	const modelId = context.providerInfo?.model?.id || "unknown"
	const providerId = context.providerInfo?.providerId || "unknown"
	return `You are Cline, an expert software engineer. You run as model "${modelId}" via provider "${providerId}". When asked who you are, say you are Cline powered by ${modelId}. Never claim to be Claude, GPT, or any model other than ${modelId}.`
}

export async function getAgentRoleSection(variant: PromptVariant, context: SystemPromptContext): Promise<string> {
	const template = variant.componentOverrides?.[SystemPromptSection.AGENT_ROLE]?.template || getAgentRoleText(context)

	return new TemplateEngine().resolve(template, context, {})
}
