---
title: "Data Download Packages Explainer"
date: 2026-04-04
kind: explanation
format: explainer
summary: "For researchers, DDPs provide access to data unavailable through any other channel. For example, APIs expose only selected, often public-facing data. Web scraping captures only what is visible on a page at a given…"
status: migrated
legacy:
  - /data-download-packages-explainer/
---

#### A Data Download Package (DDP) is a personal data archive that a user can request and download from a digital platform. It contains a structured collection of the personal data that the platform holds about that user. DDPs include activity histories, content created or consumed, interaction records, settings, advertising data, and various forms of metadata.

For researchers, DDPs provide access to data unavailable through any other channel. For example, APIs expose only selected, often public-facing data. Web scraping captures only what is visible on a page at a given moment. DDPs, on the other hand, contain private activity records, historical data stretching back to account creation, and categories of data (such as advertising interactions and inferred interests) that platforms do not otherwise share.

## Key Characteristics of DDPs

DDPs are individual-level, describing a person’s activity on a single platform. They are typically longitudinal, often spanning the entire lifetime of an account, though historical coverage varies across platforms and data types. TikTok, for example, typically provides about 3 months of watch history, while Instagram provides only 7 days. A single DDP is also multi-dimensional, potentially including dozens of distinct data categories from search history to privacy settings.

DDPs are always user-requested, meaning the user must actively initiate and complete the download process. This entails some degree of user awareness, though not necessarily a full understanding of the data. Most importantly, DDPs are platform-defined: each platform determines what to include, how to structure it, and what format to use, and researchers have no control over these decisions. DDPs are also format-unstable, i.e., their composition depends on the time of download, and platforms are under no obligation to maintain a stable format[(Boeschoten et al., 2025)](https://doi.org/10.21105/joss.05596).

#### Legal basis for DDPS

DDPs exist because of data protection legislation. The EU’s General Data Protection Regulation (GDPR), particularly[Article 15 (Right of Access)](https://gdpr-info.eu/art-15-gdpr/) and[Article 20 (Right to Data Portability)](https://gdpr-info.eu/art-20-gdpr/), requires organisations that process personal data to make that data available to the data subject upon request in a structured, commonly used, and machine-readable format.

The right of access cannot be invoked to infringe on the rights or freedoms of others (particularly other people’s data protection rights) or on trade secrets. This means that DDPs will never contain the complete internal picture a platform holds, but they do contain a legally mandated minimum.

Similar legislation exists beyond the EU: the 2017 Japanese[Act on the Protection of Personal Information (APPI)](https://www.japaneselawtranslation.go.jp/en/laws/view/4241/en), the 2020 Brazilian[LGPD](https://lgpd-brazil.info/), the 2020 California[CCPA](https://oag.ca.gov/privacy/ccpa), and the 2019 New York[SHIELD Act](https://ag.ny.gov/resources/organizations/data-breach-reporting/shield-act) together cover about 2.2 billion people. Although Australia does not have equivalent legislation, most global platforms extend DDP functionality to all users regardless of jurisdiction.

### Which Platforms Provide DDPs?

Most major digital platforms now offer some form of data download. The scope, quality, and accessibility of DDPs vary considerably across platforms.

#### Instagram

Instagram DDPs are among the richest and most commonly used in data donation research. An Instagram DDP contains around 70 distinct files, organised into folders covering the user’s Instagram activity (posts, comments, likes, stories, reels, messages), personal information (device info, profile info), connections (contacts, followers and following), logged information (link history, past insights, recent searches), ads information, security and login data, preferences (notification preferences, topics of interest), content (posts, stories, reels, archived and recently deleted items), media (photos and videos organised by date), and off-platform apps and websites.

Instagram DDPs can be requested in JSON or HTML format. JSON is preferred for research because it is machine-readable and easier to process programmatically. However, HTML is often the default option, and many participants will not change this setting even when instructed to do so. Preparation takes 5-15 minutes for specific categories and a few hours for a complete copy.

#### Facebook

Facebook DDPs are the most comprehensive of any major platform, containing approximately 54 file categories across 9 major sections. The largest section, Facebook Activity Data, encompasses 24 subcategories, including posts, messages, comments and reactions, groups, saved items, voting, polls, pages, events, marketplace, stories, short videos, and reviews. The remaining sections cover personal information and profile details, connections (friends, friend requests, group memberships), logged information (IP addresses, device data), security and login information, off-platform tracking data (apps and websites off of Facebook), preferences (notification and privacy settings), ads information (ads interacted with, ad preferences, interest profiles), and a Data Log.

The Data Log is a Facebook-specific category that includes interactions, Facebook Login records, ad impressions, ad interactions, recommendations, data shared with third parties, cookies, custom audience information, and ads on partner apps. It takes up to 15 days to prepare, which is far longer than any other DDP category. Without the Data Log, Facebook DDPs can be ready in 20–50 minutes.

#### TikTok

TikTok DDPs are more limited in scope but still contain data on video history (videos watched, time spent viewing, browsing history typically covering only the last three months), activity (likes, comments, shares, favourites, search history), profile and account information, direct messages, and advertising interactions and interest categories. TikTok DDPs can be requested in JSON or TXT format. Processing times vary and can take several days.

#### Google Takeout (YouTube and More)

Google Takeout is a comprehensive data export service that covers all Google products. A full export can include data from over 69 services. For social media research, YouTube is the most commonly requested component and includes watch history, search history, subscriptions, playlists, comments, liked videos, uploaded videos, and channel data.

YouTube allows user customisation of how much watch history is retained, making historical coverage variable across participants. Beyond YouTube, Google Takeout can export data from Google Search (search history and activity), Chrome (browsing history, bookmarks, extensions), Gmail, Maps (location history, saved places, timeline data), Drive (files and folder structures), Fit (health and fitness data), and Photos (uploaded images and metadata).

Researchers should instruct participants to select only the relevant categories to minimise data volume and participant burden. File naming in Google Takeout DDPs is language-dependent: keys in JSON files can differ depending on the participant’s language settings[(Boeschoten et al., 2025)](https://doi.org/10.21105/joss.05596), requiring special handling in data processing pipelines.

#### ChatGPT (OpenA**I)**

ChatGPT DDPs are accessed through privacy.openai.com, where users make a privacy request and verify their identity via email or phone. The DDP is delivered as a ZIP file containing a directory with a JSON file of all conversations plus uploaded files and audio recordings, generated images, user-uploaded content, and user-specific information. Each conversation uses a tree-like structure: every message is a node connected by parent–child links, starting from a root node. Users have 30 days to download the data before the request expires — substantially longer than most other platforms.

DDPs are also available from many other services. DDP content, preparation times, and download expiry vary by platform.

## How to Request a DDP

The process for requesting a DDP varies by platform but generally follows a consistent sequence. Users navigate to the platform’s data settings (typically a “Your Data” or “Download Your Information” section within account or privacy settings) and select the data categories to include.

Researchers should instruct participants to select only the categories relevant to the study. Where available, a machine-readable format (JSON over HTML) should be chosen, though researchers should be aware that the most human-readable format (HTML) is often the default. Some platforms allow users to specify a date range; for most research purposes, the full history is preferred.

After the request is submitted, the platform begins preparing the archive and may send a confirmation email or notification. When the archive is ready, the user downloads it, typically as a ZIP file.

### What DDPs Contain

- Material created or shared by the user, such as posts, comments, messages, uploads, stories, and saved content.
- User’s interactions with content and other users.
- Account creation details, profile information, username history, settings, device information, and preferences.
- Records of advertisements viewed, clicked, or otherwise interacted with. Many platforms also include the interest categories and targeting parameters used to select advertisements for the user.
- Metadata, including timestamps, device information, IP addresses, location data, security logs, and technical identifiers.

Some platforms include inferred data about users based on their activity: interest categories, topic preferences, demographic estimates, and behavioural profiles. This reveals what the platform “thinks” about the user, which can differ substantially from the user’s self-perception.

### What DDPs Do NOT Contain

- Despite their richness, DDPs have important gaps. They do not reveal algorithmic parameters – how recommendation algorithms work, what weights are applied to different signals, or why specific content was shown. They show what the user experienced, not why.
- DDPs also do not contain other users’ data. The GDPR right of access cannot be invoked to infringe on other people’s data protection rights. Facebook’s DDPs, for example, do not include information on the user’s friends (only their interactions with the data subject), nor do they provide details about Facebook’s proprietary algorithms.
- The completeness of viewing data is also limited. The definition of “seen content” varies across platforms and is often unclear. Van Driel et al. (2022) found that Instagram’s “seen_content” field most likely captures only content the participant actively clicked on, not all content scrolled past. Stories that are seen may not appear in this field.
- More broadly, platforms do not always provide data on all their features. Data of interest can simply be missing from a DDP, and researchers should always verify whether the required data is present[(Carriere et al., 2025)](https://doi.org/10.1007/s11135-024-01983-x).
- Content engagement metrics for other users’ posts are particularly difficult to obtain, as many platforms, including Facebook and Twitter, do not provide this information through their data access endpoints[(Ohme et al., 2024)](https://doi.org/10.1016/j.patter.2022.100467).

Deleted content may or may not be included, depending on the platform’s data retention policies. Finally, formatting is inconsistent: platforms may change DDP formats, structures, or included fields at any time without notice.

## Challenges of DDPs

A critical challenge for DDP-based research is that DDP formats are inherently unstable.

Structural Changes Over Time

Instagram DDPs collected in 2020 contained media folders and JSON files. By 2022, text files were stored in folders, and users could also download them in HTML format. The “seen_content” folder was merged into a new folder called “ads and topics” without advance notice. When researchers contacted Meta’s Academic Partnership Team for documentation, they were informed that the company “did not have any guides to provide” because “they are tracking this internally through some internal groups” (van Driel et al., 2022).

These changes are not rolled out simultaneously across all users. At any given time, participants may receive DDPs with different structures, making the format unstable across both time and participants.

#### Language-Dependent Naming

In YouTube DDPs, files are named differently depending on the user’s language setting. In Instagram DDPs, keys in JSON files can differ depending on the language. This means that a processing script developed using English-language DDPs may fail silently on DDPs from participants who use the platform in another language.

#### Format vs. Readability Trade-offs

Participants who are given a choice between HTML and JSON format often choose HTML even when instructed to select JSON. HTML is designed for human reading, not for machine parsing, so it might not be processed. However, depending on the platform, other formats might be provided, which might always be parsed successfully; this needs to be considered beforehand.

**Language-Dependent Keys and Filenames**

Some platforms rename files and data fields based on the user’s language setting. For example, a Google Takeout file called watch-history.json in English might be called wiedergabeverlauf.json for someone using Google in German. The labels inside the file can also change — “title” becomes “Titel”. Instagram and Facebook DDPs can behave similarly, though less predictably. This means a processing script built for English-language DDPs may not work on DDPs downloaded in another language.

**Content Language vs. Interface Language**

It is worth distinguishing between the language someone uses on their device (which affects file and field names) and the language of their actual posts and messages (which affects the data itself). For example, someone whose phone is set to Arabic but who writes posts in English will have Arabic file names containing English content.

### Data Preprocessing and Cleaning

Raw DDP data requires substantial preprocessing before it is suitable for analysis. While Data Relay provides automated preprocessing features for DDP handling, researchers working with DDPs need to understand these steps beforehand to consider them when submitting funding and ethics applications, explaining how it works to other researchers or participants, managing potential risks related to data accuracy, or designing their own donation pipelines.

#### Initial Inspection

Before processing, DDPs need to be inspected to verify the format (JSON, HTML, or CSV) and to make sure it meets expectations. Confirm that the expected data fields are present; platforms can add, remove, or rename fields at any time. One needs to check for empty files or folders, which may indicate the participant had no activity of that type or that the platform did not export that category. If there are format changes, researchers need to log the DDP version or structural characteristics for each participant so that format changes can be tracked across the dataset.

#### Parsing and Extraction

DDP data is typically nested or hierarchically structured. JSON DDPs require recursive parsing to extract nested records. Common processing steps include handling missing keys, variable nesting depth, and mixed types (a field that is a list for one participant may be a single string for another).

For HTML DDPs, parsing requires HTML parsing libraries (e.g., BeautifulSoup in Python) with CSS selectors or XPath expressions. However, if the DDP format has changed, it may cause errors and result in incomplete/unsuccessful donations.

#### Timestamp Standardisation

DDPs from different platforms use different timestamp formats. Instagram and Facebook typically use Unix timestamps (seconds since epoch), e.g. 1692113136 (Aug 15, 2023, 14:25:36 UTC). Google Takeout uses ISO 8601 strings, e.g. “2023-08-15T14:25:36Z”. TikTok uses mixed formats. All timestamps are converted to a common format (UTC ISO 8601 or Unix epoch) during preprocessing, and researchers should be aware that some platforms store timestamps in the user’s local timezone while others use UTC.

#### De-identification

Before analysis, DDPs must be de-identified in accordance with the ethics protocol. Direct identifiers (usernames, full names, email addresses, phone numbers) should be removed or replaced with pseudonymous identifiers. Indirect identifiers (location data, timestamps that reveal routines, device identifiers, IP addresses) should be assessed for re-identification risk and removed or generalised as needed. Third-party identifiers (names and usernames of other users appearing in messages, tags, or interactions) must also be handled — these people have not consented to the study.

#### Data Validation

After parsing, researchers should verify data integrity. For instance, check that extracted timestamps fall within the expected range (e.g., between account creation and download date) and verify that participant identifiers are unique and consistent across data categories. Counts also need to be cross-validated: if a DDP claims 500 posts, the extracted dataset should contain approximately 500 records; otherwise, anomalies need to be flagged and investigated, such as empty datasets, impossibly large counts, or dates outside the expected range.

## Practical Recommendations for DDP Research

### Before the Study

Researchers should inspect several DDPs from persons in the population they intend to sample. This will reveal format variation, missing fields, and unexpected data categories. A fresh DDP should be requested immediately, since DDP formats can change at any time.

### During the Study

Every submitted DDP should be validated, and the results logged. Data Relay provides tools for this purpose. Attrition at each stage should be monitored, with the expectation of substantial dropout between willingness and successful donation; sample sizes should be planned accordingly.

Clear, illustrated instructions are also important as technical difficulty is the dominant barrier to donation. In one study, 83% of failed donors cited technical problems[(Keusch et al., 2024)](https://doi.org/10.1177/1525822X231225907). Step-by-step screenshots and platform-specific guidance may significantly reduce dropout. The study should be carefully tested, as data donation studies have more points of failure than traditional survey research[(Boeschoten et al., 2025)](https://doi.org/10.21105/joss.05596).

### Post-Donation

Document any format changes observed mid-study. Report preprocessing decisions (how missing fields were handled, which timestamps were excluded, how de-identification was performed) to support reproducibility.

## Summary

Data Download Packages are one of the most common forms of data donation. They provide rich, longitudinal, individual-level data that captures dimensions of platform use, including advertising exposure, inferred interests, and interaction patterns that no other method can access. However, they are platform-defined, inconsistently structured, format-unstable, and incomplete in ways that vary across platforms and change over time.

Understanding DDP-specific challenges (format instability, language-dependent naming, default format selection, variable preparation times, and content gaps) is important for designing robust studies. AIO’s Data Relay addresses many practical obstacles. Empirical evidence consistently shows that often technical difficulty, not unwillingness, is the primary barrier to successful donation, and that in-person assistance can dramatically improve completion rates.

Research using DDPs requires ethical safeguards due to the highly sensitive personal information they contain. It is important to help participants fully understand exactly what information they are choosing to share before they consent to donate. Before any analysis begins, researchers must remove obvious details (names, usernames) or indirect clues (location, people tagged in photos). All collected data must be placed in a secure, encrypted system with strict access controls.

The AIO provides infrastructure that addresses the practical challenges of DDP-based research: project registration, participant onboarding, DDP parsing, data review, visualisation, and secure storage. Nevertheless, researchers also must carefully prepare and structure their studies to account for these challenges.
