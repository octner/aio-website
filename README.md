# AIO website (test version)

Test version of the new website of the Australian Internet Observatory (AIO). It is a static site built with [Astro](https://astro.build) 7 and published with GitHub Pages.

- The plan, the menu, and the open decisions: [`PLAN.md`](PLAN.md). The test version also shows it at `/plan/`.
- The graph of all pages: `docs/site-graph.svg`. `scripts/site-graph.mjs` draws it again before every build.
- How the outreach team edits content: [`EDITING.md`](EDITING.md).
- Inventory of the current WordPress site: [`docs/inventory.md`](docs/inventory.md). The verbatim copies in `docs/wordpress-copy/` are local and excluded from Git.
- The Miro board exports (`New AIO website IA.jpg`, `.pdf` and `.svg`) and `internal/` are local working files. `.gitignore` keeps them out of the repository.

## Run it on your computer

Needs Node.js 22.23.4 or newer (the GitHub workflow uses Node 24).

```bash
npm ci
npm run dev        # http://localhost:4321, rebuilds on every change (search does not work here)
npm run build      # builds the site into dist/
npm run preview    # serves dist/, with search
npm run check      # checks internal links, images and test-mode noindex tags in dist/
npm run check:code # checks the types and templates (astro check)
npm run test:store # tests the comment and post store with mocked Google and GitHub services
```

To build exactly as GitHub Pages does, under a sub-path:

```bash
BASE_PATH=/aio-website SITE_URL=https://example.github.io npm run build
BASE_PATH=/aio-website npm run check
```

## How it is built

| Path | What it contains |
|---|---|
| `src/content/pages/` | One Markdown file per page. `about/team.md` becomes `/about/team/`. `index.md` is the home page text. |
| `src/content/posts/` | News, events, and case studies (`type:`). Each becomes `/news/<file name>/`. |
| `src/content/resources/` | Learning resources, sorted by Diátaxis kind (`kind:`). Each becomes `/learn/resources/<file name>/`. |
| `src/content.config.ts` | The fields of each kind of file. The build stops with a clear message if a file breaks them. |
| `src/data/site.json` | Settings: test mode, the design (`a` or `b`), AIO Platform and training addresses, feedback, analytics, licence, contact, social links, funding text. |
| `src/data/navigation.json` | The menu: five groups with an icon and a description for each item, the "This site" links, and the review links of the test version. An item with `"hidden": true` stays out of the menus, and its page and address still work. |
| `src/data/training.json` | The modules of the learning system, shown on `/learn/training/`. |
| `src/layouts/Base.astro` | The frame of every page: head, fonts, test banner, menu, comment box, footer, and the small optional script. |
| `src/layouts/Page.astro` | The three columns of a content page: section menu, text, and "On this page". |
| `src/components/` | Header (menu), Footer, Brand (logo), Icon, Feedback, Listing (news, events, resources, training, search, review, site map), PostList, Video. |
| `src/lib/` | `site.ts` (settings and menu helpers), `content.ts` (collections and dates), `figures.ts` (diagrams and the page graph in Markdown). |
| `src/pages/` | Routes: `index.astro` (home), `[...slug].astro` (all Markdown pages, the plan, and the redirect pages), `news/[id].astro`, `learn/resources/[id].astro`, `rss.xml.js`, `404.astro`. |
| `src/styles/tokens.css` | Colours, fonts, and widths of design A, with the variable names of the learning system, and of design B. `global.css` contains the rules of both designs. `design-b.css` contains the rules of design B only. |
| `public/graphics/` | The AIO logo (`aio-logo.svg`, copied from internetobservatory.org.au), its mark for the browser tab (`aio-mark.svg`, `aio-mark.png`), and the icon set (`icons.svg`, copied from the learning system, with one added magnifier). |
| `src/assets/` | The arcs motif of the home page band, and the diagrams copied from the learning system. |
| `scripts/site-graph.mjs` | Draws `docs/site-graph.svg` from the menu and the `status` of each page. |
| `scripts/postbuild.mjs` | Removes redirect and review pages from the sitemap, adds the GitHub Pages sub-path to root-relative links, and removes local metadata and placeholders from the build. |
| `scripts/check-links.mjs` | Fails if any internal link, image, or `#` target is broken. |
| `scripts/import_wordpress.py` | Imported the WordPress posts from the local `docs/wordpress-copy/posts/` archive (kept for the final migration). |
| `docs/feedback/comments.gs` | Google Apps Script web app that reads and writes the shared comment sheet. Its `doGet` and `doPost` also pass post-editor requests to `posts.gs`. |
| `docs/feedback/posts.gs` | The post editor's part of the same Apps Script project: submissions, the approval trigger, and the write to GitHub. |
| `src/components/PostEditor.astro`, `src/scripts/post-editor.ts` | The post editor at `/editor/` (test version only). |
| `src/lib/post-source.mjs` | Reads a post file for the editor, with the git sha that the store compares before an edit. |
| `scripts/test-comment-store.mjs`, `scripts/test-post-store.mjs` | Tests of the store with mocked Google and GitHub services, including a save of every existing post. |
| `.pages.yml` | Configuration of Pages CMS, the browser editor. |
| `.github/workflows/deploy.yml` | Builds, checks links, and publishes on every push to `main`, and every night. |
| `.github/workflows/check.yml` | Builds and checks every pull request, without publishing. |

### Decisions in the code

- **Links are written from the site root** (`/news/`), in templates and in Markdown. `scripts/postbuild.mjs` adds the sub-path while the site lives at `<account>.github.io/aio-website/`. After the move to internetobservatory.org.au, `BASE_PATH` is empty and nothing has to change.
- **Old WordPress addresses** are listed in the `legacy:` field of the page or post that replaces them. The build writes a small redirect page at each one. It stops if an old address would replace a new page, or if two items claim one address.
- **No JavaScript framework.** Scripts in `Base.astro` close the menu on Escape, load YouTube after a click, and add section links in test mode. The test-version comments use `src/scripts/comments.ts` and `src/scripts/comment-store.ts`. Search loads Pagefind.
- **Test mode** (`"draft": true` in `site.json`) adds the banner "Test – Under Development", the comment box, the status labels, `noindex`, and the pages `/plan/`, `/review/`, and `/site-map/`. Set it to `false` for the real site.
- **Search indexing.** In test mode every HTML page, including redirects, has a `noindex` tag. The build check fails if a test HTML page lacks it. Crawlers must be allowed to visit pages to see the tag, so do not block them with `robots.txt`. Search engines may take time to remove pages already indexed, and `noindex` is not access control or a guarantee for non-HTML files. Keep confidential material off the public site.
- **Two designs.** `"design"` in `site.json` is `a` or `b`. `Base.astro` writes it on the page as `<html data-design="...">`. Design A is the learning system's design. Design B has the colours of internetobservatory.org.au and monospace headings, after the look of the template "varsha" by myndlabs (varsha.myndlabs.tech). Its rules are our own, and no file of the template is in this repository. The template's licence asks for a visible credit, so the footer of design B says "Design built with varsha by myndlabs", with a link to myndlabs.tech. Keep that line while design B is in use. Every rule of design B starts with `[data-design='b']`, so design A does not change. To roll back, set `"design": "a"`. To remove design B, follow the note at the top of `src/styles/design-b.css`.
- **Design switch of the test version.** The test banner has the buttons "Design A" and "Design B". They change the design for one browser and remember the choice there. Each new comment records the design on screen in its `title` column. The real site has no switch.
- **Design A and the learning system.** The `:root` block of `tokens.css` uses the variable names and values of the learning system's `app/style.css`. The icons (`<Icon name="..."/>`, 24-pixel grid, always with a text label) and the diagrams are copies from the learning system. The learning system's `docs/graphics-kit.html` describes the conventions.
- **Fonts.** Inter Tight is for text, Space Grotesk for the headings of design A, and JetBrains Mono for the headings of design B. They come from the Fontsource npm packages (Latin subset) and are served by the site itself. `Base.astro` registers them under the family names of the learning system, so the text of the diagrams uses them too. A browser downloads only the fonts that the design on screen uses. The body text is 18 pixels.
- **Diagrams in Markdown.** A page asks for a diagram with `<div data-diagram="donation-journey"></div>` on its own line. `src/lib/figures.ts` puts in the vertical version (`-v.svg`) of the diagram, which fits the text column. The marker `![All pages ...](docs/site-graph.svg)` puts in the page graph, which also shows on GitHub.
- **Analytics.** GoatCounter loads only when `analytics.goatcounter` in `site.json` contains the code of a GoatCounter site.
- **Images in the test version still load from the current WordPress server.** Copy them into `public/uploads/` before the domain moves.

## Feedback channel

The test site can send page, menu and review-question comments to a Google Sheet. It is disconnected until `feedback.commentsUrl` is set in `src/data/site.json`. The page then offers buttons to comment and shows the comments for that page and the menu.

**Privacy:** the web app URL is public in the website. Anyone with it can read non-hidden comments and submit comments, without signing in. The sheet itself can remain restricted, but that does not make the API private. Do not use this for confidential or personal information. Google account quotas apply; there is no authentication or effective spam protection.

### Set up the comment sheet

1. Create a Google Sheet using an account that can own and maintain the service. Copy the spreadsheet ID from its URL, between `/d/` and `/edit`.
2. Open `docs/feedback/comments.gs` in this project and copy its entire contents, not its file path. In the sheet, open **Extensions > Apps Script**, replace everything in `Code.gs` with the copied code, and save.
3. In **Project Settings > Script Properties**, add `SPREADSHEET_ID` with the spreadsheet ID. The script creates a `Comments` tab and its headers on the first request. Do not rename or reorder its columns.
4. Choose **Deploy > New deployment > Web app**. Execute as **Me**, allow access to **Anyone**, and authorize the requested spreadsheet permissions. If your organisation prevents this access, an administrator must approve it or you must use another account. Copy the deployed URL ending in `/exec`, not the test URL ending in `/dev`.
5. Set `feedback.commentsUrl` to that URL in `src/data/site.json`. Optionally set `feedback.sheetUrl` to the sheet's URL for the "Open all comments" link. Share the sheet with the team members who need to edit it; do not make the sheet public just to make the website work.
6. Rebuild and publish the site. In a private browser window, submit a test page comment, a menu comment and a review answer. Confirm that each appears on the site and in the `Comments` tab. Remove the test rows afterwards.

In the sheet, set a row's `status` to `done` to mark it done or `hidden` to remove it from the website's API. Hidden rows remain in the sheet. This does not revoke copies already retrieved. Set it back to `open` to show the row again. To update the script, save the code and use **Deploy > Manage deployments** to edit the web app deployment and select a new version. Check **Executions** in Apps Script if the site reports an error. If it says `ReferenceError: docs is not defined`, replace the file path in `Code.gs` with the contents of `docs/feedback/comments.gs`, then deploy a new version.

## Post editor (test version)

`/editor/` lets anyone with its address add a news post, an event or a case study, or change one, without an account. It uses the same Apps Script web app as the comments.

1. A submission only adds a row to the `Posts` tab of the sheet, with the status `submitted`. It never reaches GitHub.
2. A team member who can edit the sheet reviews the row and sets its status to `approve`.
3. The script checks the row again and writes `src/content/posts/<name>.md` to GitHub with a token. The deploy workflow then publishes the site in about 2 minutes.
4. The script sets the status to `published` and puts the commit link in `result`, or it sets `conflict` or `error` with the reason. Set `rejected` to decline a row.

The store refuses raw HTML in the text, except the video block of `EDITING.md`. It refuses links to `javascript:` and `data:` addresses. An edit keeps every field that the editor does not show, for example `legacy` and `status`. If the post changed on GitHub after the editor page was built, the store sets `conflict` and writes nothing.

### Set up the post editor

1. On GitHub, open **Settings > Developer settings > Personal access tokens > Fine-grained tokens** and generate a token. Set an expiry date, limit its access to the `aio-website` repository, and set **Contents** to **Read and write**. Grant no other permission, so the token cannot change the workflows.
2. In Apps Script, replace `Code.gs` with the current `docs/feedback/comments.gs`. Add a script file named `Posts` with the contents of `docs/feedback/posts.gs`.
3. In **Project Settings > Script Properties**, add `GITHUB_TOKEN` (the token), `GITHUB_REPO` (`<account>/aio-website`), and optionally `GITHUB_BRANCH` (default `main`).
4. In the script editor, choose the function `setUp` and select **Run**. Authorise the new permissions for external requests and triggers. The log ends with "Ready". You can run it again safely.
5. Use **Deploy > Manage deployments** to edit the web app deployment and select a new version. The address stays the same.
6. In the sheet's **Share** settings, make sure that people with the link cannot edit the sheet. Everyone who can edit the sheet can publish posts.
7. Check it. Open `<web app address>?page=/` and confirm that the comments still load. Send a test post from `/editor/`, set its status to `approve`, and wait for `published` and the commit link. Wait until the site has rebuilt, then reload the editor, edit the same post, and approve it. GitHub Pages may serve the old editor page for up to 10 minutes, and an edit from that old page ends as `conflict`. Then delete the test post on GitHub and the test rows.

The sheet menu **AIO website > Publish approved posts** runs the publication again by hand. An expired or wrong token shows as `error` with GitHub's answer in `result`.

## Publish on GitHub Pages

1. Create a public repository named `aio-website`.
2. In Settings › Pages, set Source to **GitHub Actions**.
3. Push this folder to `main`. The workflow "Deploy to GitHub Pages" builds, checks links, and publishes the site at `https://<account>.github.io/aio-website/`. If it ran before step 2, run it again from the Actions tab.
4. Set `repository` in `src/data/site.json` to `<account>/aio-website`, so that every page gets an "Edit this page on GitHub" link in its footer.

The workflow publishes only `dist/`. A public repository also exposes its tracked source and documentation, which should be reviewed before pushing. `.gitignore` excludes the WordPress archive, local working documents, environment files, dependencies and build output, but does not remove files that were already tracked.

The workflow also rebuilds the site every night, so finished events move to "Past events". GitHub pauses scheduled workflows in a repository without activity for 60 days. Then run the workflow by hand from the Actions tab, or make any commit.

Before launch, set `"draft": false` in `src/data/site.json`. This removes the banner, the comment box, the status labels, the section links, `/plan/`, `/review/`, `/site-map/`, and the `noindex` tag.

Custom domain: set it in Settings › Pages › Custom domain and follow GitHub's DNS guide. A `CNAME` file is not needed with the Actions workflow.
