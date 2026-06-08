import { SystemPromptSection } from "../templates/placeholders"
import { TemplateEngine } from "../templates/TemplateEngine"
import type { PromptVariant, SystemPromptContext } from "../types"

const BROWSER_RULES = `- The user may ask generic non-development tasks, such as "what\\'s the latest news" or "look up the weather in San Diego", in which case you might use the browser_action tool to complete the task if it makes sense to do so, rather than trying to create a website or using curl to answer the question. However, if an available MCP server tool or resource can be used instead, you should prefer to use it over browser_action.\n`

const BROWSER_WAIT_RULES = ` Then if you want to test your work, you might use browser_action to launch the site, wait for the user's response confirming the site was launched along with a screenshot, then perhaps e.g., click a button to test functionality if needed, wait for the user's response confirming the button was clicked along with a screenshot of the new state, before finally closing the browser.`

const CLI_RULES = `- After making code changes, consider running any available validation tools for the project (such as type checkers, linters, test suites, or build scripts) to catch errors, since you won't receive automatic diagnostics after edits.\n`

const getRulesTemplateText = (context: SystemPromptContext) => `RULES

- Working directory: {{CWD}}. You cannot \`cd\` to another directory — prepend \`cd path &&\` to commands when needed.
- Do not use ~ or $HOME for home directory paths.
- Before running commands, check SYSTEM INFORMATION for the user's OS/shell and adapt accordingly.
- Use search_files for regex searches across files. Combine with read_file and replace_in_file for comprehensive analysis and changes.
- When creating new projects, organize files in a dedicated directory. Use appropriate structure for the project type.
- Consider project context when making changes. Follow existing coding standards.
- Use replace_in_file or write_to_file directly — no need to display changes first.
- ${context.yoloModeToggled !== true ? "Only ask questions via ask_followup_question, and only when truly needed. Prefer using tools to find answers yourself." : "Apply best judgment without asking followup questions."} For example, use list_files to check if a mentioned file exists rather than asking the user for the path.
- Do not assume command success without output. Verify with follow-up checks (exit status, ls, grep).${context.yoloModeToggled !== true ? " If output is unavailable after checks, use ask_followup_question." : ""}
- Use \`--\` before positional args that may start with \`-\`.
- If the user provides file contents in their message, don't re-read the file.
- Your goal is to accomplish tasks, not engage in conversation.
- Produce exactly what the task specifies — no extra output, debug info, or commentary.
- When fixing bugs: if existing tests fail, fix your code, don't modify test assertions (unless asked).
- After fixing bugs, run the project's test suite, not just your own reproduction script.
{{BROWSER_RULES}}{{CLI_RULES}}- NEVER end attempt_completion with a question. Make results final.
- Do NOT start messages with "Great", "Certainly", "Okay", "Sure". Be direct and technical.
- Use vision capabilities to analyze provided images.
- environment_details at the end of messages is auto-generated context, not user input. Use it but don't assume the user is referring to it.
- Check "Actively Running Terminals" in environment_details before starting new processes.
- replace_in_file: use complete lines in SEARCH blocks. List multiple SEARCH/REPLACE blocks in file order. Do NOT modify marker format.
- Wait for user response after each tool use to confirm success.{{BROWSER_WAIT_RULES}}
- Use MCP operations one at a time, waiting for confirmation.`

export async function getRulesSection(variant: PromptVariant, context: SystemPromptContext): Promise<string> {
	const template = variant.componentOverrides?.[SystemPromptSection.RULES]?.template || getRulesTemplateText

	const browserRules = context.supportsBrowserUse ? BROWSER_RULES : ""
	const browserWaitRules = context.supportsBrowserUse ? BROWSER_WAIT_RULES : ""
	const cliRules = context.isCliEnvironment ? CLI_RULES : ""

	return new TemplateEngine().resolve(template, context, {
		CWD: context.cwd || process.cwd(),
		BROWSER_RULES: browserRules,
		BROWSER_WAIT_RULES: browserWaitRules,
		CLI_RULES: cliRules,
	})
}
