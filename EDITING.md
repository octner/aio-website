# How to edit the AIO website

This guide is for the outreach team. You need no software on your computer. Every change goes live 1 to 2 minutes after you save it.

There are two ways to edit:

- **Pages CMS** (first choice): a web editor with forms, at app.pagescms.org. It is not set up yet. See "Set up Pages CMS" at the end.
- **GitHub's file editor** (works now): you edit the text file of a page in the browser. You need a GitHub account with write access to the repository.

Both ways change the same files, so you can use either one.

## Words used in this guide

- **Repository:** the folder on GitHub that holds the website files.
- **Markdown:** plain text with a few marks. `## Heading` makes a heading. `**bold**` makes bold text. `[link text](/about/)` makes a link.
- **Front matter:** the block between the two `---` lines at the top of each file. It holds the title, the date and other fields.
- **Commit:** a saved change. GitHub keeps every commit, so any change can be undone.

## Add a news post

### With Pages CMS

1. Open app.pagescms.org and sign in.
2. Select **News and events**, then **Add an entry**.
3. Fill in Title, Date, Type and Summary. Add an image and its description if you have one.
4. Write the text.
5. Untick **Draft** when the post is ready to appear on the site.
6. Select **Save**.

### With GitHub's file editor

1. Open the repository on GitHub and go to the folder `src/content/posts`.
2. Select **Add file**, then **Create new file**.
3. Name the file with short words joined by hyphens, ending in `.md`. Example: `new-data-donation-study.md`. The name becomes the address: `/news/new-data-donation-study/`.
4. Copy the template below into the file and fill it in.
5. Select **Commit changes**. Choose "Commit directly to the main branch" if you may publish, or "Create a new branch and start a pull request" if somebody must check it first.

Template (copy everything, including both `---` lines):

```markdown
---
title: The title of the post
date: 2026-11-20
type: news
summary: One or two sentences for the news list.
image:
imageAlt:
author:
draft: false
---

Write the post here. Leave an empty line between paragraphs.

## A subheading

More text. [A link to the team page](/about/team/).
```

The template is also in the file `docs/templates/news-post.md`.

### Rules for the fields

| Field | What to write |
|---|---|
| `title` | Required. Sentence case: "New study on TikTok ads", not "New Study On TikTok Ads". If the title contains a colon (`:`) or starts with a quote mark, put the whole title in double quotes: `title: "SICSS: call for applications"`. The same applies to `summary`. |
| `date` | Required. Year-month-day, for example `2026-11-20`. |
| `type` | `news`, `event` or `case-study`. Events appear under Events. Case studies appear on the Case studies page (`/case-studies/`), which is out of the menu for now. |
| `summary` | One or two sentences. They appear in the lists and on the home page. |
| `image` | Leave empty, or give the address of an image, for example `/uploads/photo.jpg`. |
| `imageAlt` | What the image shows, for people who cannot see it. Required when there is an image. |
| `draft` | `true` keeps the post off the site. `false` publishes it. |

For an **event**, add these fields under `type: event`:

```markdown
eventStart: 2026-12-03T13:00:00+11:00
eventEnd: 2026-12-03T14:00:00+11:00
location: Online
registration: https://example.org/register
```

The `+11:00` is Melbourne daylight saving time, from the first Sunday in October to the first Sunday in April. Use `+10:00` for the rest of the year. For an event that lasts whole days, write only the dates (`eventStart: 2026-12-03`) and add the line `allDay: true`: the site then shows the dates without a time.

### With the post editor of the test version

The test version has a post editor at `/editor/`. You need no account. Choose "New post" or an existing post, fill in the form, and select **Send for approval**. A team member approves the post in the shared sheet, and the site shows it about 2 minutes later. The editor refuses HTML in the text, except the video block below.

## Edit a page

1. Open the page on the website.
2. Scroll to the bottom and select **Edit this page on GitHub**. The link appears when the repository address is set in `src/data/site.json`.
3. Change the text below the second `---` line. Leave the front matter as it is, unless you change the title or the summary.
4. Select **Commit changes**.

Do not create or delete pages yourself. A new page needs an item in the menu, so ask the developer.

## Add an image

1. Make the image smaller than 300 KB. A width of 1600 pixels is enough.
2. In GitHub, open the folder `public/uploads`, select **Add file**, then **Upload files**.
3. In the text, write `![What the image shows](/uploads/file-name.jpg)`.

## Add a YouTube video

Put this on its own line, and replace `VIDEO_ID` (the 11 characters after `v=` in the YouTube address) and the title:

```html
<div class="video" data-youtube="VIDEO_ID"><a href="https://www.youtube.com/watch?v=VIDEO_ID"><img src="https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="play">Play video: TITLE</span></a></div>
```

The YouTube player loads only when a visitor selects the video.

## If something goes wrong

- **The site did not change.** Open the **Actions** tab of the repository. A red cross means that the build stopped. Open it: the message names the file and the field that is wrong. The live site stays as it was until the error is fixed.
- **Undo a change.** In the repository, open the file, select **History**, find the earlier version, and copy its text back. Or ask the developer to revert the commit.

## Writing rules

- Keep pages short. One topic per page.
- Link text names its target: "Read the ethics guide", not "Read more".
- Every image needs a description in `imageAlt` or in the `![...]` brackets.
- Use Australian spelling and write "AIO Platform" with a capital P.

## Set up Pages CMS (once, by an administrator)

Not tested yet. Do this test before the team relies on Pages CMS.

1. Open app.pagescms.org and sign in with GitHub as the owner of the repository.
2. Install the Pages CMS GitHub App on the website repository only. Read the list of permissions on the install screen.
3. Open the repository in Pages CMS. It reads `.pages.yml` and shows the forms.
4. Invite one outreach team member by email who has no GitHub account. Check that they can add a draft post.
5. Check that the post file in `src/content/posts` looks like the template above, and that the site still builds.
6. Save an event with a start time. Check that the file has the time with its offset, for example `2026-12-03T13:00:00+11:00`.
7. Open and save the home page (`index.md`), the page `news.md` and the post `webinar-doing-digital-platform-research-with-aio.md` without changes. Compare the files before and after in the commit: the fields `legacy`, `status`, `listing`, `video` and `blocks`, and the video block in the text, must still be there. `.pages.yml` sets `merge: true` for this. If the editor removes the video block, the developer changes the body field to a plain Markdown field.
