# Inventory of the current AIO website

Taken on 14 November 2026 by reading every address in the WordPress sitemap (15 pages and 28 posts). Verbatim text copies are in the local `docs/wordpress-copy/` archive, which is excluded from Git. The machine-readable version, with all fields, is `docs/inventory-data.json`.

Verdict: **keep** = carry to the new site, **merge** = fold into another page, **drop** = leave out.

| Old address | Title | Kind | Date | Verdict | Reason |
|---|---|---|---|---|---|
| `/` | Home | page |  | keep | This is the page that WordPress treats as the front page: its body class is "home" and its canonical link is "/". It was modified last (7 October 2026). Carry it over, but fold in the shorter wording of /home-2/ and cut the repeated sections. |
| `/home-2/` | Home | page |  | merge | Merge into the new home page (/). About 70 per cent of the text is the same as on /. Its hero wording and its short challenge text are clearer than those on /, so use them there. Then drop this address and redirect it to /. |
| `/explore/` | Explore | page |  | merge | Merge into the new home page and the menu. The page only introduces three pages that the menu already lists, plus one post. Keep its four short texts as the card texts on the home page. Keep a visible link to "Research projects using AIO 2026", because this page is the main route to it. |
| `/explore/get-started/` | Get Started | guide |  | keep | The text is short and useful, and it is the natural entry page for researchers. Add the missing links to each step when it moves to the new site. |
| `/explore/observe/` | Observe | explainer |  | keep | This is the core description of what AIO offers. Carry it over under a name that matches its heading, for example "Data collection methods" or "Tools". |
| `/explore/learn/` | Learn | page |  | keep | This is the page that will link to the learning system, so it must stay. Rewrite the dated parts (the summer institute, "available soon") and repair the wrong links when it moves. |
| `/global-search/` | Global Search | other |  | drop | The page is empty and no menu links to it. The real search runs on another address. On a static site, a search tool that runs in the browser replaces both. |
| `/about/` | About AIO | page |  | keep | This is the core description of the organisation. Carry the text, fix the typo, and add alt text to the logos. The list of related observatories from /networks/ can become a section here. |
| `/about/team/` | AIO Team | page |  | keep | The content is current (last modified 27 August 2026) and needed. In the new site, store people as a data list so that editors change one entry. Remove the placeholder text. |
| `/networks/` | Research Networks | page |  | merge | The page has 6 links and about 150 words of its own text, and it is not in the menu. Fold it into /about/ as a section 'Related observatories and networks'. |
| `/contact/` | Contact Us | page |  | keep | A contact page is needed. On a static site, keep the email address and social links. Replace the form with a mail link or an external form service, and remove the 'department' sentence. |
| `/terms/` | Terms & Conditions | page | 2025-04-17 | merge | Carry this text to a single page named 'Privacy policy' that replaces both /terms/ and /privacy-policy/. Review the cookie and analytics statements, because a static site will collect less data. |
| `/privacy-policy/` | Privacy Policy | page |  | drop | It is placeholder template text with a localhost address. The real policy text is on /terms/ and should take the name 'Privacy policy'. |
| `/participate/` | Participate | page |  | keep | It is the only entry page for research participants. Keep the text, give each block its own correct link, and fix the two broken buttons. Check the overlap with /share-your-data-for-research/ when that page is reviewed. |
| `/resources/` | Resources | other |  | keep | A resources index is needed and all 4 filters return correct results. In the new site, build it from the content files, with one type per item and a simple filter without page reload. |
| `/news-and-events/` | News & Events | other |  | keep | Keep one combined listing. In the new site, give each item exactly one type (news or event), give events a real event date, and filter without page reload. |
| `/news-and-events/news/` | News & Events | other |  | merge | Fold into /news-and-events/. In the new site, 'News' can be a filter state of the one listing, with a redirect from this address. |
| `/news-and-events/events/` | News & Events | other |  | merge | Fold into /news-and-events/. In the new site, 'Events' can be a filter state of the one listing or a short 'Upcoming events' block, with a redirect from this address. |
| `/algorithms-dictate-everything-we-see-time-to-crack-them/` | Algorithms dictate everything we see. Time to crack them | news | 2026-04-06 | keep | It is a real media mention with a working link and player (both returned 200 on 14 November 2026). Carry it as a short 'in the media' news item. Replace the iframe with a plain link to the episode, or load the player only on click. |
| `/ethics-guide/` | Research Ethics Guide | guide | 2026-04-02 | keep | It is original AIO guidance and one of the two items in the Guide category. Carry it as a guide page with a contents list, real headings, links and a reference list. An owner must update the National Statement reference and decide whether the missing consent sections exist. |
| `/faq/` | FAQ | guide | 2026-04-01 | keep | The content is short, correct in form and needed. Carry it as a permanent FAQ page built with plain HTML details elements. Split it by reader (participants, researchers) and link each answer to the explainer or guide that covers it. |
| `/current-research-projects/` | Research projects using AIO 2026 | case-study | 2026-04-06 | keep | This is the only page that shows who uses AIO and for what. Carry it after a copy-edit. In the new site, make each project one short entry in a 'Research projects' collection, so that people can add a project as one file. |
| `/doing-digital-platform-research-webinar-april-2026/` | Webinar: Doing Digital Platform Research with AIO | webinar | 2026-04-01 | merge | Merge with the recording page https://internetobservatory.org.au/how-to-do-digital-platform-research-using-aio/ (Resource, Video, 4 May 2026). Its YouTube video https://www.youtube.com/embed/EEzlKi5nT8k is titled 'Doing Digital Platform Research with the Australian Internet Observatory Webinar April 2026'. The new site should have one event entry with the date, the speakers and the recording, and no registration button after the event. |
| `/aio-critical-to-information-integriy-senate-report/` | AIO critical to information integrity on climate change and political advertising – reports | news | 2026-03-31 | keep | It is recent, substantial and shows the policy value of AIO. Carry it with a corrected slug and a redirect from the old URL. Copy the image to the new site with alt text. |
| `/tracking-targeted-advertising-on-intimate-hygiene-products/` | Tracking targeted advertising on intimate hygiene products | news | 2026-01-27 | keep | It is a recent example of research done with AIO tools, with working links to the source. Carry it, and point the dead link to the new page for the screen-tracking tool. |
| `/building-global-connections-for-national-research-infrastructure-2/` | Building global connections for national research infrastructure | news | 2025-09-09 | keep | It is a short, complete archive news item. Carry it under a clean slug without '-2', with a redirect. It has low priority and needs no rewrite beyond the typo. |
| `/what-political-ads-are-australians-seeing-online/` | What political ads are Australians seeing online? | news | 2025-05-01 | keep | It is a substantial article by AIO researchers and is the fullest account of the election monitoring work. Carry it as a republished item with the five authors in the front matter, the subtitle as a subtitle field, and a canonical link to the original. |
| `/dark-ads-challenge-truth-and-our-democracy/` | ‘Dark ads’ challenge truth and our democracy | news | 2024-03-04 | keep | It is a substantial article by AIO people under a CC BY 4.0 licence. Carry it with the date corrected to 2025-02-25, the three authors in the front matter, one credit line and a canonical link to 360info. An owner must confirm the date change. |
| `/social-media-algorithms-are-shrouded-in-secrecy-were-trying-to-change-that/` | Social media algorithms are shrouded in secrecy. We’re trying to change that | news | 2024-08-06 | keep | It is the clearest plain statement of why the AIO exists. Keep it in the news archive with its 2024 date, and check the republication conditions of The Conversation before migration. |
| `/aio-presentations-at-the-hass-and-indigenous-research-data-commons-symposium-2025-now-available/` | AIO Presentations at the HASS and Indigenous Research Data Commons Symposium 2025 now available | news | 2025-12-10 | keep | The two videos and the speaker summary are useful. Fix the spelling, the dead 'Tools' link and the wrong description on migration. The demo video is also a candidate for the Resources section. |
| `/sicss-melbourne-2026/` | SICSS-Melbourne 2026 – Call for Applications | event | 2026-04-22 | keep | Keep as a past event in the archive and mark the call as closed. The three SICSS posts are candidates for one SICSS-Melbourne 2026 event page, but I read only this one. |
| `/partnering-for-public-data-literacy-qut-dmrc-at-woodford-folk-festival-2024/` | Partnering for public data literacy: QUT DMRC at Woodford Folk Festival 2024 | news | 2024-05-13 | keep | Short public-engagement story with photos. On migration, replace the wrapped link, confirm the date, remove the repeated photos, add alt text and reduce the gallery. |
| `/share-your-data-for-research/` | Share your data for research | explainer | 2026-04-01 | keep | This is the main content for participants, and at 1,082 words it is the longest of the nine. Edit it into the participant page of the new site. I did not read /participate/, so check for overlap with that page. |
| `/what-is-your-tiktok-personality-a-new-citizen-science-project-can-tell-you/` | What is your ‘TikTok personality’? A new Citizen Science project can tell you | news | 2025-04-17 | keep | It documents a named project that uses the AIO. Fix the two dead links and the quote, and confirm with the project team whether participation is still open. |
| `/how-to-do-digital-platform-research-using-aio/` | How to do digital platform research using AIO? | video | 2026-05-04 | merge | Merge into https://internetobservatory.org.au/aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research/. The surviving page takes the categories Resource and Video and the tag Data donation, so one page serves both the news list and the resources list. |
| `/aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research/` | Video now available – Doing Digital Platform Research with AIO | webinar | 2026-05-04 | keep | Keep as the single page for this webinar. Fold in /how-to-do-digital-platform-research-using-aio/, add the categories Resource and Video and the tag Data donation, give it a shorter address and shorten the text. |
| `/aio-co-design-process-invites-national-research-community-inputs/` | ARDC co-design process invites feedback on AIO mid project | news | 2026-05-04 | keep | Keep in the news archive as a record and mark it as closed. If the team does not want closed calls in the archive, drop it. The overview PDF stays on the ARDC site. |
| `/building-digital-platform-observatories-symposium/` | Building Digital Platform Observatories Symposium | event | 2026-05-07 | merge | Merge into /bdo-event-uq-june-2026/ (the report on the same event). Carry over the date, venue, speaker list with links and the funding acknowledgement as an "Event details" block. Drop the registration button and deadline. Redirect the old URL. |
| `/online-ads-are-becoming-harder-to-spot-but-were-not-powerless-to-stop-it/` | Online ads are becoming harder to spot – but we’re not powerless to stop it | news | 2026-06-09 | keep | It is substantive writing by AIO researchers. Carry it as a news item marked as a repost, with the three authors and the original link in the front matter. Host the second image locally or link to it. |
| `/high-school-students-explore-ai-media-literacy-and-digital-futures/` | High school students explore AI, media literacy and digital futures | news | 2026-06-09 | keep | It shows AIO tools in public outreach. Carry it as a short news item marked as a repost, and remove the repeated paragraph. |
| `/sicss-2026-kicks-off-in-melbourne/` | SICSS 2026 starts in Melbourne | news | 2026-06-20 | keep | It is the fullest record of the 2026 program and speakers. Repair the broken link and the first sentence, and link it to the first-week post. |
| `/bdo-event-uq-june-2026/` | Shaping the future at Building Digital Platform Observatories | news | 2026-06-24 | keep | It is the lasting record of the event. Fold the event details from /building-digital-platform-observatories-symposium/ into it and use one category. |
| `/sicss-melbourne-2026-our-first-week/` | SICSS-Melbourne 2026 – Our First Week | news | 2026-06-24 | keep | It holds the only photos and first-hand account of the event. Carry it as a dated news item, link it to the SICSS preview post, and add alt text. A merge of the two SICSS posts into one page is a possible later edit. |
| `/data-download-packages-explainer/` | Data Download Packages Explainer | explainer | 2026-04-04 | keep | It is core reference content and the natural link to the learning system. Carry it as a guide page with a table of contents. Remove the repeated sections and repair the citations. |
| `/screen-capture-explainer/` | Screen Capture Explainer | explainer | 2026-04-02 | keep | It is core reference content, a pair with the DDP explainer. Carry it as a guide page, remove the test tag and the stray character, and add links to the DDP explainer and the ethics guide. |
| `/aio-launch-new-2026/` | The all new AIO platform is here! | news | 2026-09-23 | keep | It is the main product announcement and the entry point to the platform. Repair the Google Docs link, replace the webinar invitation with a dated note or a recording, and add a featured image. |

## Problems seen on each page

### `/`

- Two pages are titled "Home". The menu item "Home" goes to /home-2/, but the logo goes to this page (/).
- The video is configured to start by itself with sound on and to repeat (settings in the HTML: autoplay true, mute false, loop true). I did not render the page, so I did not watch this happen.
- The level-2 heading under "The Digital Transformation Challenge" is a full sentence of 32 words.
- The card links use /observe and /learn. These work only through WordPress redirects.
- The "View all news + events" button is in the HTML twice (one copy for desktop, one for mobile).
- One news card shows two overlapping categories: "News" and "News and Events".
- The text repeats itself: "The tools that power digital observation" restates the cards above it, and "Work with us" repeats the Get Started introduction word for word.
- The page loads 26 stylesheet files and 19 script files, and its main content holds 28 image elements.

### `/home-2/`

- Duplicate home page. The address "home-2" is a WordPress default name, and the page is open to search engines with its own canonical link.
- The four "What we want to achieve" cards are link elements with no target. A click on them goes nowhere.
- The link "Participate / Donate Your Data" has a double slash (/participate//).
- The label "Explore the Platform" opens the Explore page of the website, not the AIO Platform (app.internetobservatory.org.au).
- This page has no link to the AIO Platform in its main content, although / leads with it.
- The level-2 heading under "The Digital Transformation Challenge" is two sentences (41 words).
- The "View all news + events" button is in the HTML twice (one copy for desktop, one for mobile).
- The site search lists this page as "Home" next to the real home page.

### `/explore/`

- Dead link: the desktop button "View all news + updates" goes to /news, which returns 404 (I tried it). The mobile copy of the button goes to "#".
- The label "Explore" does not say what the page holds. The menu also lists its three child pages beside it, at the same level.
- All body text is marked up as level-4 headings, and each whole section is one link.
- There is an empty level-4 heading in the "AIO Data Collection Methods" block.
- Two of the links (/get-started, /observe) work only through WordPress redirects.
- Heavy images: the four photos and screenshots are 289 KB, 498 KB, 521 KB and 533 KB (sizes from the server headers). The two stock photos have no alternative text.
- The news grid is the same as on the home page.

### `/explore/get-started/`

- The main content has 0 links. The text names the Resources section, the About page, the Ethics section, an ethics template and the platform, but links to none of them.
- Step 5 says to create a project on the platform, with no link or button to https://app.internetobservatory.org.au/.
- The text mentions an "Ethics section". The menu has no item with that name.
- "HREC" is not written out on this page.
- The step icons repeat: one icon serves steps 2 and 4, another serves steps 3 and 5.
- The page sits under /explore/ in the address, but the menu shows it before "Explore" at the same level.

### `/explore/observe/`

- Three names for one page: the menu says "Observe", the browser title says "Observe", and the main heading says "AIO Data Collection Methods".
- The main heading ends with an invisible character (zero-width space).
- The three introduction paragraphs are marked up as level-4 headings.
- Spelling varies: "DDPs" and "DDPS". The second introduction paragraph has no full stop.
- The "APIs & Archives" section has no link, also not for the AIReD dashboard. It speaks of the future ("will be provided") and gives no date.
- The page has no link to the AIO Platform and no link to Get Started.
- The page repeats the opening of the two explainer posts and then shows the same two posts again in the grid.
- Both section images have no alternative text.

### `/explore/learn/`

- Wrong link: the button "Subscribe to stay up to date" opens the Screen Capture Explainer, not the newsletter form.
- Wrong link: the button "Follow us on socials" opens the home page.
- "Talk to us!" names the contact page, the News & Events page and the newsletter, but links to none of them.
- Placeholder: "AIO Library will be available soon", with no date and no link.
- Outdated text: the summer institute ended on 3 July 2026. The text mixes past and present tense and has an error ("The school run from").
- There is an empty level-2 heading before "Talk to us!".
- Three names for one page: menu "Learn", browser title "Learn", main heading "Training & Support".
- The resource grid is the same as on the Observe page.
- A personal work email address is in the page text as a mailto link.

### `/global-search/`

- Empty page: the result grid has an empty "nothing found" block with no text.
- The heading says "Search Result" although no search has run.
- A query on the page itself fails: /global-search/?s=data returns the 404 page (I tried it).
- The page was last changed on 28 May 2025 and is still open to search engines.
- The search field has no visible label and no placeholder text.

### `/about/`

- Typo in the partner text: 'Queensland University of Technolgoy'.
- On tablet and mobile widths, the button 'View all news + updates' links to '#', so it goes nowhere. The desktop button 'View all news + events' works.
- Heading levels skip: the page goes from H1 to H3, and 'Our Partners' is an H6 heading.
- The 8 logos have no usable alt text. The alt text is empty or a file name, for example '7e157377bccf520ec21084fb5ea7ad4b'.
- The HTML <title> is 'About' but the visible H1 is 'About AIO'.
- The same block of 4 news cards ('Feeling Curious?') is repeated on /about/team/ and /participate/.
- The same introduction video is also embedded on /participate/. YouTube reports the ADM+S Centre channel as its owner, not the AIO channel.
- The heading 'Data Collection Tools' contains an invisible zero-width space character.

### `/about/team/`

- Placeholder text is visible at the bottom of the page: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'. I confirmed it in a rendered page at 1280 px width.
- The image for Robert Glasgow is a file named 'Pattern_01', a decorative pattern and not a named portrait file.
- Most portraits have empty alt text or a file name as alt text, for example 'WhatsApp Image 2026-08-11 at 4.14.18 PM', 'IMG_3077' and 'Headshot-scaled'.
- Titles do not match the biographies: the heading says 'Prof Heather Ford' and the text says 'Dr Heather Ford'. The heading says 'Prof Matteo Vergani' and the text says 'Associate Professor'.
- Two of the 3 former members (Robert Fleet, Luke Munn) have no role text.
- The HTML <title> is 'Team', the H1 is 'AIO Team', and an H2 lower on the page is also 'AIO Team'.
- The page is long: 26 person cards in one column of sections, and 44 <img> tags in the HTML.
- The block of 4 news cards is the same as on /about/ and /participate/.

### `/networks/`

- No header menu item and no footer link points to this page on any of the 11 pages that I read.
- On tablet and mobile widths, the button under the resource cards reads 'View all news + updates' and links to '#'. The label is wrong for a resources block and the link goes nowhere.
- The 6 organisation names are H6 headings directly under the H1.
- The HTML <title> is 'Networks' but the H1 is 'Research Networks'.
- The Smart Data UK text is in the first person ('Our mission is to...'), so it reads as if AIO speaks.
- I could not verify the GESIS link: the server returned HTTP 403 to automated requests. The other 5 links returned HTTP 200.

### `/contact/`

- The text asks the visitor to choose 'which department you would like to send your enquiry to', but the form has no department field.
- The form depends on a WordPress plugin (WPForms Lite), on JavaScript and on Google reCAPTCHA version 2. It cannot move to a static site unchanged.
- The Name field has the placeholder 'Enter your first name', which does not match its label.
- The LinkedIn icon has empty alt text.
- This page loads 30 external script files, the highest count of the 11 pages.
- I could not verify the LinkedIn link: the server returned HTTP 403 to automated requests. The Bluesky account and the YouTube channel exist.

### `/terms/`

- The labels do not match the content. The URL is /terms/, the HTML <title> is 'Terms of Service', the H1 is 'Terms & Conditions' and the footer link is 'Terms'. The body calls itself 'this Privacy Policy' 4 times.
- The site has no actual terms of service text.
- The HTML has 6 empty H4 headings, one before each of the 6 section headings.
- The effective date is 17 April 2025, but the page metadata shows a last change on 30 April 2026.
- The text says the site gives visitors options to opt out of non-essential data collection. I did not check whether such a control exists.
- I could not verify the OAIC link: the server returned HTTP 403 to automated requests. The legislation.gov.au link returned HTTP 500 to one client and loaded correctly in a second client.

### `/privacy-policy/`

- This is the default WordPress privacy template. All 9 sections still start with 'Suggested text:'.
- It gives the website address as 'http://localhost:8081', a developer's local address.
- It describes visitor comments and user accounts, which are features of WordPress and not statements written by AIO.
- The page body has no H1 heading. The title 'Privacy Policy' comes from the HTML <title> tag.
- No header menu item and no footer link points to it on the 11 pages that I read. The real privacy policy is at /terms/.
- The page metadata shows a last change on 4 July 2025.

### `/participate/`

- The desktop button 'View all news + updates' links to /news, which returns HTTP 404.
- On tablet and mobile widths, the second 'View all news + updates' button links to '#'.
- The button 'About AIO' links to '/', the home page, and not to /about/.
- Each of the 3 text blocks is one large link to the same page, /share-your-data-for-research/. The phrases 'Learn more about each kind.' and 'Find out more about sharing your data' are not separate links.
- The page has no direct way to take part: no list of open studies and no sign-up link.
- The 3 photos have empty alt text.
- The page is in the footer menu only. The header menu has no 'Participate' item.
- The video and the block of 4 news cards repeat content from /about/.

### `/resources/`

- Each card shows two category labels with no space between them, for example 'ResourceVideo' and 'Case studyResource'.
- The post 'Screen Capture Explainer' carries a test tag, 'test123', in its HTML classes.
- Card images are generic. The video item shows the site favicon, and two items show icon files ('quote-footer.svg', 'open-source.svg'). All 7 card images have empty alt text.
- The filter needs a dropdown, 5 checkboxes and a 'Filter Results' button that reloads the page, for a list of 7 items.
- 'FAQ' and 'Share your data for research' are standing pages, but the site files them as dated posts (01/04/2026).
- The HTML <title> is 'Resource Archives' but the H1 is 'Resources'.
- Dates use the numeric form DD/MM/YYYY, which readers outside Australia can misread.
- The closing block 'Our current toolkit' is the same as on the news listing.

### `/news-and-events/`

- Three overlapping categories exist: 'News', 'Events' and 'News and Events'. One item (10/12/2025, HASS and Indigenous Research Data Commons Symposium presentations) has only 'News and Events', so neither the News filter nor the Events filter returns it.
- The 'Webinar' filter returns 1 item, the news post 'The all new AIO platform is here!'. It does not return the item titled 'Webinar: Doing Digital Platform Research with AIO'.
- The 'Workshop' filter returns 0 items.
- Cards show two labels with no space between them: 'NewsWebinar' and 'NewsNews and Events'.
- Event cards show the publication date, not the date of the event. The symposium card shows 07/05/2026, while its image file name contains '16-June-2026'.
- The listing does not separate upcoming events from past events. Only 2 items have the category 'Events'.
- The newest card ('The all new AIO platform is here!') uses the site favicon as its image. 13 of the 21 card images have empty alt text.
- The HTML <title> is 'News and Events Archives' but the H1 is 'News & Events'.
- Two post addresses contain errors: '/aio-critical-to-information-integriy-senate-report/' (typo) and '/building-global-connections-for-national-research-infrastructure-2/' (a '-2' suffix).

### `/news-and-events/news/`

- The address does not narrow the list to news. It shows all 21 items, including the 2 items with the category 'Events' only. The News filter on the same page returns 18 items.
- It is a full duplicate of /news-and-events/.
- The HTML <title> is 'News Archives' but the H1 is 'News & Events'.
- The footer menu item 'News' leads here, so a visitor who expects news only gets the combined list.

### `/news-and-events/events/`

- The address does not narrow the list to events. It shows all 21 items. The Events filter on the same page returns 3 items.
- It is a full duplicate of /news-and-events/.
- The HTML <title> is 'Events Archives' but the H1 is 'News & Events'.
- A visitor cannot see which events are upcoming. The 2 items with the category 'Events' appear to be past events of April and June 2026.

### `/algorithms-dictate-everything-we-see-time-to-crack-them/`

- Very thin: 114 words of main text.
- The only text link goes to the podcast show, not to the episode. The episode is reachable only through the embedded player.
- The item gives no episode date and does not name the podcast publisher.
- The player is a third-party iframe from Spotify. It adds weight and tracking to a very short page.
- The featured image has no alt text.
- The byline is the name of the WordPress account, not a stated author.

### `/ethics-guide/`

- The page has zero links. It names the National Statement, the Australian Code, the FAIR and CARE principles and AIO tools, and links to none of them.
- It has four in-text citations (Strycharz et al., 2024; van Driel et al., 2022; Ohme et al., 2021; ACSA, 2025) and no reference list.
- It cites the National Statement as '2007, updated 2018'. A web search summary says the 2025 edition has been in effect since 23 June 2026 and replaced the 2023 edition. I could not confirm this on the NHMRC page itself, because the request timed out. Another post on the site (Building global connections) already cites the 2025 edition.
- Very long for one page: 2,158 words, with no contents list and no anchors.
- Only 7 real headings (H2). 11 sub-headings are bold paragraphs and 4 are italic paragraphs, so they are not headings for a screen reader or for a contents list.
- The page ends after one consent section, 'Data Donation: Full Informed Consent'. The section compares data donation with other methods, but no other method follows. I checked that the live page and the JSON copy end at the same sentence, so the guide looks unfinished.
- Three tool names appear without a definition or a link: Data Donation Registration System (DDRS), AIO Data Laboratory and Data Relay.
- The sample paragraphs contain placeholders in square brackets, such as [Platform Name]. These are intended, but they need care in Markdown.
- The guide is stored as a blog post with a date and a personal byline, not as a maintained page.

### `/faq/`

- The FAQ is a dated blog post in the Guide category with a 'By AIO' byline. It is not a page and is not in the main menu structure.
- The title 'FAQ' is followed at once by a second heading 'FAQs'.
- The accordion is set to open every item by default, so it adds script and markup but hides nothing. This is the only one of the ten pages built with Elementor widgets inside the content.
- No answer has a link. The DDP answers do not link to the Data Download Packages Explainer, and the storage answer does not link to a privacy or terms page.
- The questions mix two readers: participants ('Who will have access to my data?') and researchers.
- Three of the eight questions repeat the topic of the separate Data Download Packages Explainer.
- Wording is vague in places ('understand engagement scenarios'), and spelling mixes 'analyzing' with 'behaviour'.
- The featured image is an unrelated icon with no alt text.

### `/current-research-projects/`

- Editing residue in three places, where the old and the new wording both remain: 'Mobile RoverAIO's Mobile Observatory Ad Toolkit', 'seeencounter' and 'theMobile Rover'.
- The text says 'roughly 1 from a third-party entity', written as a digit. The source article says roughly one ad for each party ad.
- The link https://adobservatory.org/ is dead from here: the host name did not resolve on this machine or through the public resolvers 1.1.1.1 and 8.8.8.8 on 14 November 2026. The ADM+S page https://www.admscentre.org.au/adobservatory/ returned 200 and can replace it.
- Two FARE links returned 403 to a header-only request. I could not verify them.
- Tool names differ from other pages: 'Mobile Rover', 'Browser Rover' and 'Mobile Observatory Ad Toolkit' here, 'Mobile Observation Ad Toolkit' and 'Mobile Online Advertising Toolkit (MOAT)' elsewhere.
- The introduction is marked up as a heading (H4), and the heading 'The For You' is not the project name.
- The slug 'current-research-projects' does not match the title 'Research projects using AIO 2026'. The year in the title will go out of date.
- No featured image, so the card in a listing has no picture.
- The fourth project repeats the news post 'What political ads are Australians seeing online?'.
- It is the only item in the 'Case study' category, and it holds four case studies in one post.

### `/doing-digital-platform-research-webinar-april-2026/`

- The event is past (21 April 2026), but the page still reads as an invitation with two 'Register now' buttons. The Humanitix link still returns 200.
- The page says the event will be recorded but does not link to the recording. The recording is on another page.
- The event date has no year in the text. The only date shown as data is the publication date, 01/04/2026.
- The publication date is 1 April 2026 in site time and 31 March 2026 in the UTC metadata.
- The post is in the category 'Events' only. The child category 'Webinar' exists but is not used here.
- Typo 'Excllence', and the closing bracket of '(ADM+S)' sits inside the link.
- The same banner appears twice: as the featured image and at the end of the text. The file name contains 'matt-version'.

### `/aio-critical-to-information-integriy-senate-report/`

- The URL slug has a typo: 'integriy'. The correctly spelled URL returns 404.
- The image in the text loads from images.squarespace-cdn.com, not from the AIO site. It has no alt text. If that host removes the file, the image breaks.
- The lead sentence is marked up as a heading (H3).
- Time words are relative ('last week', 'This week'), so the reader must work out the dates from the post date.
- Two expansions of one tool name in one item: 'Mobile Observation Ad Toolkit' and 'Mobile Online Advertising Toolkit (MOAT)'.
- The link text says '2023 UNESCO Global Declaration on Information Integrity Online', but the file name of the target is 'un-global-principles-for-information-integrity'. The target may be a different document. I did not open the PDF.
- The key findings are typed with bullet characters and line breaks, not as a list.
- Three links (aph.gov.au and two on apo.org.au) returned 403 to a header-only request. I could not verify them.
- The closing bracket and italics around '(Declaration' are broken in the last paragraph.

### `/tracking-targeted-advertising-on-intimate-hygiene-products/`

- The internal link to https://internetobservatory.org.au/screen-tracking returns 404. It is the only link from this item to an AIO tool.
- Both images have no alt text. The image in the text is a stock photo with the caption 'Source: Unsplash'.
- The post date shown is 27/01/2026, and the last line says 'First published 13 Jan 2026'. That second date is the date of the ABC article, which the line does not say.
- Two words in one phrase are separately bold and italic ('how to observe personalised advertising'), which leaves stray markup.
- The byline 'By AIO' is the account name.

### `/building-global-connections-for-national-research-infrastructure-2/`

- The slug ends in '-2'. The URL without '-2' redirects to this page, so no second copy is live. The suffix is a leftover.
- The text is in the present and future tense about an event of 10 September 2025 ('is currently undertaking', 'will deliver').
- Typo: 'with with'.
- The same photo is the featured image and the image in the text, and neither has alt text.
- Both GESIS links returned 403 to a header-only request. I could not verify them.
- The image files were uploaded in April 2026 with generic names (image-1.webp).

### `/what-political-ads-are-australians-seeing-online/`

- The content holds a second H1 heading (the subtitle 'Astroturfing, fake grassroots groups, and outright falsehoods'), so the page has two H1 headings.
- The page shows 'By Daniel Angus' (the account name), but the text names five authors.
- The author list appears twice, at the top and at the end.
- The link text 'Australian Internet Observatory' points to an ADM+S project page, not to an AIO page.
- It is a republished article. The canonical link in the page head points to the AIO copy, not to the original. I found no The Conversation page-view counter in the page. The Conversation's republishing rules normally ask for one, but I did not re-read those rules today.
- Typo carried in the text: 'Acknowlegement'.
- The text has 38 links. 37 returned 200. One (journals.sagepub.com) returned 403 to a header-only request, so I could not verify it.
- The featured image has no alt text.

### `/dark-ads-challenge-truth-and-our-democracy/`

- Wrong date. The page shows 04/03/2024 and the metadata says 2024-03-04. The text says it was first published on 25 February 2025, and the 360info page metadata confirms 2025-02-25. The article is about the 2025 election, so the 2024 date is an error. It also puts the item last in any list sorted by date.
- The page shows 'By Daniel Angus' (the account name). The text says 'Written By Amanda Lawrence, Daniel Angus and Mark Andrejevic'.
- The text names three authors, but the biographies at the end cover only two (Angus and Andrejevic).
- The credit line 'Composite art by Michael Joiner, 360info CC BY 4.0' appears twice, at the top and at the end.
- The four H2 headings are also set in bold.
- A footnote uses literal asterisks ('toolkit*' and '*AIO editors note'). These need escaping in Markdown, and I escaped them in the saved copy.
- The canonical link in the page head points to the AIO copy, not to the 360info original.
- Four journal links (three on journals.sagepub.com, one on tandfonline.com) returned 403 to a header-only request. I could not verify them. The other 13 links returned 200.
- The featured image has no alt text.

### `/social-media-algorithms-are-shrouded-in-secrecy-were-trying-to-change-that/`

- Dead link: the aph.gov.au committee page returns 404.
- The eSafety link redirects to a different page (https://www.esafety.gov.au/about-us/industry-regulation).
- Three links could not be verified because the sites blocked my automated request (HTTP 403 or 202): Taylor & Francis, Mozilla Foundation, figshare. I do not report them as dead.
- The author is named three times: in the template byline, in the first line of the body and at the end.
- The text is dated. It says 'in recent weeks' and 'currently' about events of 2024, and 'we will soon be inviting' donations.
- The page says only 'a Creative Commons license'. I did not check the licence type or its republication conditions.

### `/aio-presentations-at-the-hass-and-indigenous-research-data-commons-symposium-2025-now-available/`

- Dead link: 'Tools' points to a Squarespace staging address that returns 404.
- The page description and excerpt read '2-3 pm AEST (UTC+10) Tuesday 21 April'. That text does not belong to this post.
- One person is spelled two ways: 'Lauren Heydon' and 'Lauren Hayden'.
- Typing errors in the source: 'Ad Obverstory 2.0' and 'social research.For those' (no space).
- The phrase 'being developed in Aired' is unclear. It may be a product name or an error.
- The mailto link ends with a stray '?'.
- The category is 'News and Events', while most posts use 'News'. The breadcrumb therefore differs from other posts.

### `/sicss-melbourne-2026/`

- The event has passed (June 22 to July 3, 2026). The page still reads as an open call and shows no closing date for applications.
- The organisation names link to LinkedIn pages, not to the organisations' own sites. LinkedIn blocked my automated check (HTTP 403), so I could not verify those two links.
- The second list item joins two separate points with a line break.
- The site has two more SICSS posts that I did not read: /sicss-2026-kicks-off-in-melbourne/ and /sicss-melbourne-2026-our-first-week/.

### `/partnering-for-public-data-literacy-qut-dmrc-at-woodford-folk-festival-2024/`

- The link to the DMRC summary is an Outlook 'safelinks' address. Safelinks is the Microsoft email wrapper that rewrites links. The address contains a staff email address in its parameters. Replace it with the clean target.
- Date mismatch: the post shows 13/05/2024, but the linked DMRC summary has 2025/05/13 in its address. I could not verify the correct date.
- All 17 gallery images have empty alt text.
- The file names suggest that three photos appear twice (names with and without '-1'). I did not view the images.
- The post ends with a line of seven hashtags, which is social media text.

### `/share-your-data-for-research/`

- 'For more information on this method, go here.' has no link.
- The page has no links and no call to action: no study to join, no contact, no link to the platform.
- The heading '1. Data Download Packages (DDPs)' has no matching '2.'. The second method is under the heading 'Screen Capture', while its text calls it Observed Data Packages (ODP). Two names for one thing.
- The research-ethics text appears twice word for word: in the paragraph under 'Keeping your data safe' and in the 'Research ethics' bullet.
- The lead paragraph is marked up as a level-4 heading. Heading levels then jump between h4 and h3.
- Each ordered list sits inside an empty outer list item in the source. The source also has one empty h4 and three empty layout containers.
- Unclear phrase: 'why it matters/what it is important'.
- A paragraph ends without a full stop: 'privacy and security measures'.

### `/what-is-your-tiktok-personality-a-new-citizen-science-project-can-tell-you/`

- Dead link, used twice: foryouparticipate.net/tiktok/ returns 404. The root of that site now points to https://foryouresearch.net/participate.
- Dead link: 'Australian Internet Observatory' in the first line points to a Squarespace staging address that returns 404.
- The QUT profile link returned HTTP 403 to my automated request, so I could not verify it.
- Quotation marks are broken in the Wikström quote (doubled opening marks and a stray mark inside the quote).
- Grammar slips in the source: 'why do you see, what you see', 'how the TikTok curates', 'study online recommender system of TikTok'.
- The call to take part is dated (2025 election). I could not verify whether the study still accepts participants.

### `/how-to-do-digital-platform-research-using-aio/`

- Duplicate: it embeds the same video (YouTube id EEzlKi5nT8k) as the news post 'Video now available – Doing Digital Platform Research with AIO', published five minutes apart on the same day.
- Very thin: 50 words, no speakers, no date of the webinar, no links.
- No featured image is set, unlike the other eight posts.
- The title is a question and promises a how-to guide, but the page is only a video.

### `/aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research/`

- The address does not match the title. The slug is 'aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research'.
- Duplicate video: the same recording is on /how-to-do-digital-platform-research-using-aio/.
- The third bullet ends with a stray 'Q&A'. It reads as a fifth item that lost its line.
- The post gives no date for the webinar. The video title says April 2026.
- Only this post of the nine has Prev/Next links inside the body. They are part of the post content, not of the template.
- Five long paragraphs describe the webinar in general terms and repeat one another.

### `/aio-co-design-process-invites-national-research-community-inputs/`

- The consultation closed on 31 May 2026. The page still reads as an open invitation.
- The submission email address is marked as a link but has no target, so a click does nothing.
- The address does not match the title. The slug is 'aio-co-design-process-invites-national-research-community-inputs'.
- The title is unclear: 'feedback on AIO mid project'.
- The post does not say what happened after the consultation. I found no outcome on this page.

### `/building-digital-platform-observatories-symposium/`

- Obsolete: the event was on 16 June 2026, but the post still shows a "Register now" button and says registrations are open until 12 June 2026.
- The text is in the future tense ("will host") five months after the event.
- Kellie Vella has the label "University of Queensland", but her link goes to a Queensland University of Technology profile. I could not check which is right, because that page refused my request (HTTP 403).
- The post calls the same event a "symposium" and a "workshop".
- The one image has no alt text. It is a stock photo with the event title on it.
- Not verified: the UQ event page (HTTP 403) and the two Unsplash links (HTTP 401) refused an automated request. The Humanitix link answered HTTP 200.
- The Nic Carah link redirects to https://about.uq.edu.au/experts/1512.
- A report on the same event exists as a separate post (/bdo-event-uq-june-2026/), and the two posts do not link to each other.

### `/online-ads-are-becoming-harder-to-spot-but-were-not-powerless-to-stop-it/`

- The site shows "By Lauren Hayden", but the byline in the text names three authors: Daniel Angus, Lauren Hayden and Nicholas Carah.
- The byline in the text is set as a level-3 heading.
- One image loads directly from images.theconversation.com, not from the AIO site.
- The Instagram embed is a pasted iframe that still carries The Conversation's page address in its parameters.
- The post has a credit line with a link to The Conversation. I found no Conversation republish counter in the HTML. I did not check the republishing terms.
- The page's share-image field (og:image) is empty, although the post is marked as having a featured image.
- Both images have no alt text.
- Not verified: four journal links (HTTP 403) and two Facebook business links (HTTP 400) refused an automated request.
- The post has no tags.

### `/high-school-students-explore-ai-media-literacy-and-digital-futures/`

- One paragraph about the data workshop appears twice in slightly different words. The first copy is a body paragraph set between two decorative quote images (quote.svg and quote-footer.svg), so it looks like a pull quote. In my saved copy I wrote it as a quote block and left out the two decorative images.
- The article is a repost from ADM+S, and the site author is "AIO".
- The photo is only 768 by 432 pixels and has no alt text.
- Not verified: the Stephen Harrington profile at QUT refused an automated request (HTTP 403).
- The post has no tags.
- This post and the other post of 9 June 2026 never appear in the "latest news" cards under the news posts.

### `/sicss-2026-kicks-off-in-melbourne/`

- Broken link: the "aired" link has the address "ttps://www.aio.eresearch.unimelb.edu.au/" (the "h" is missing). With the "h" the address answers HTTP 200.
- The first sentence shows a raw address in brackets after "(SICSS)", which looks like leftover Markdown.
- The dashboard is written "aired" here and "AIReD" in the other SICSS post.
- The address of the post says "kicks-off" and the title says "starts".
- The post says 19 participants. The post /sicss-melbourne-2026-our-first-week/ says 20.
- The text says "next week", so it is out of date after the event.
- The post body has no image.
- Not verified: two QUT profile links refused an automated request (HTTP 403). The Swinburne profile link (experts.swinburne.edu.au/12345-dominique-carlon) answered HTTP 200 with only a generic page title.
- The post has no tags.

### `/bdo-event-uq-june-2026/`

- The post has two overlapping categories, "News" and "News and Events". The page shows them run together as "NewsNews and Events".
- The report does not give the date or venue of the event and does not link to the announcement post.
- The report has only one link, and it names no speaker profiles.
- The site shows the date 24/06/2026 (local time). The page metadata gives 23 June 2026 in UTC.
- The address "bdo-event-uq-june-2026" uses an abbreviation (BDO) that the page does not explain.

### `/sicss-melbourne-2026-our-first-week/`

- The title says "Our First Week", but the text covers only days 1 to 3 and was written during the event ("We will finish day 3", "Excited for the remaining 9 days!").
- The post says 20 participants. The post /sicss-2026-kicks-off-in-melbourne/ says 19.
- The text has no links. The address of the original LinkedIn post is plain text.
- The LinkedIn address points to another person's post, but the site author is "Bogdan Mamaev".
- All five photos have no alt text and no captions, and the files have number names.
- The title tag uses a hyphen and the page heading uses an en dash.
- The phrase "Winter (Summer) Institute" is not explained.
- No report on the second week or on the results exists among these pages.
- The post has no tags.

### `/data-download-packages-explainer/`

- Very long page: about 2,900 words, with no table of contents, no images and no tables.
- Repeated content: the section "Language-Dependent Naming" and the later block "Language-Dependent Keys and Filenames" say the same thing. Unstable formats are explained in three places.
- The heading levels are out of order. The lead paragraph is set as a level-4 heading. "Structural Changes Over Time" is plain text, and two other sub-headings are bold text.
- The heading "ChatGPT (OpenAI)" has broken bold marks around its last letters, and "Legal basis for DDPS" has a capital S.
- Citation years do not match the linked papers. "Boeschoten et al., 2025" (3 uses) links to a paper that Crossref dates 2023. "Ohme et al., 2024" links to a 2022 paper by Ohme and Araujo.
- "van Driel et al. (2022)" is cited twice with no link, and the page has no reference list.
- A space is missing before every citation link and before several law links (for example "format(Boeschoten").
- The page names "Data Relay" four times but never explains it or links to it. "privacy.openai.com" is plain text.
- The page does not link to the AIO Platform, the ethics guide or the screen capture explainer.
- The page shows two category labels run together ("ExplainerResource"). The breadcrumb says "Resource" and the section address is /resources/.
- Not verified: the Keusch paper link refused an automated request (HTTP 403). I did not check the facts about each platform, such as file counts and preparation times.

### `/screen-capture-explainer/`

- Test content: the post has the public tag "test123", and the tag page /tag/test123/ answers HTTP 200.
- Step 4 of the list ends with a stray backslash ("discarded.\").
- The page has no links at all. It says "see the resources section" for DDPs, but gives no link.
- The page has no image, diagram or video of the method.
- The method has three names on one page: "screen capture", "screen tracking" and "screen recording".
- Small language errors: "a data donation method that enable", "DDPS", "eg Meta Ad Library" with no full stop.
- Technical terms such as "YOLOv11" and "reactivity bias" are not explained for the stated audience.
- The page does not say which tool or app does this, or how a researcher starts.
- The page shows two category labels run together ("ExplainerResource").

### `/aio-launch-new-2026/`

- Wrong link: the words "Australian Internet Observatory" in the first paragraph link to a Google Docs edit address, which looks like the draft of the text. The address answered HTTP 200 with no sign-in redirect. I did not open the document.
- Out of date: the webinar is "tomorrow at 1pm AEST" with no date. The post is dated 23 September 2026, so the webinar was on 24 September 2026, and the "Register" link remains.
- The post has no featured image, so its listing card shows the site favicon (Favicon.png).
- The category "Webinar" is on a news post that only invites readers to a webinar. The page shows the labels run together ("NewsWebinar").
- The Jenny Fewster quotation has no closing quotation mark. A space is missing in "researchers.“Researchers".
- The lead paragraph is set as a level-4 heading and the section headings as level-5 headings.
- The list of platform functions sits inside an empty outer list item in the HTML. My saved copy shows it as one flat list.
- The link to the AIO site uses http, and it redirects to https.
- The article says "a AIO Platform demo" and has no link to the DDP explainer or the ethics guide.
- The login link redirects to a sign-in page at app.internetobservatory.org.au. I did not sign in.

