# Guide for AI Agents

Welcome, Agent. This repository is a structured system for managing the startup and project ideas of **@sh20raj** (Shaswat Raj). Your role is to assist in the **management, documentation, and expansion** of these ideas while adhering to the established architecture.

## 👥 Roles & Responsibilities
- **Author (@sh20raj):** The source of all primary ideas and strategic vision. Detailed profile: [what-i-know.md](./what-i-know.md).
- **AI Agent (You):** Responsible for organizing, formatting, indexing, and maintaining the repository.

## 📂 Repository Structure
- `/startup`: High-level business and startup concepts.
- `/projects`: General software project ideas.
- `/libs`: JavaScript/TypeScript library ideas.
- `/templates`: Markdown templates with standardized Frontmatter.
- `/assets`: Organized by category and idea (e.g., `assets/startup/cutuu/`).

## 🖼️ Asset Management Rules
When adding assets (logos, pitch decks, screenshots):
1. **Location**: Place them in the idea's own folder (e.g., `startup/cutuu/`).
2. **Naming**: Use lowercase with hyphens (e.g., `logo-final.png`).
3. **Common Assets**: Place generic images in `assets/common/`.
4. **Linking**: Use relative paths in Markdown.

## 📝 Rules for Adding New Ideas
When the user provides a new idea or PSD, follow these steps:

1. **Categorize:** Choose the correct folder (`startup/`, `projects/`, or `libs/`).
2. **Folder Creation**: Create a new folder for the idea (e.g., `startup/cutuu/`).
3. **README**: Create a `README.md` inside that folder using the corresponding template from `/templates/`.
4. **Assets**: Place all related assets (logos, pitch decks) directly in the same folder.
5. **Frontmatter:** Ensure the YAML metadata is fully populated:
   - `status`: `backlog`, `in-progress`, `executed`, or `archived`.
   - `created_at`: Use current date.
   - `link`: Direct URL if available.
   - `priority`: 1..5.
4. **Relative Links:** **NEVER** use absolute local paths (e.g., `file:///`). Always use relative paths for in-repo links to ensure GitHub compatibility.
5. **Update Indexes:**
   - Update the category-specific `README.md` (e.g., `startup/README.md`) table.
   - Increment statistics in the root `README.md`.

## 🔄 Maintenance Tasks
- Keep the root `README.md` dashboard up to date.
- Ensure all category READMEs correctly list their respective files.
- When requested, help the author refine ideas or generate technical specs (LLD/HLD).

## 🚀 Execution Philosophy
- **Speed & Precision:** Act quickly but maintain the premium aesthetic and structure.
- **Portability:** Ensure all changes are ready for `git push`.
- **Author-First:** Always prioritize the author's vision and "What I Know" context.

---
*Maintained by the AI Management Layer*
