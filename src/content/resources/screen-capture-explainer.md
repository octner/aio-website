---
title: "Screen Capture Explainer"
date: 2026-04-02
kind: explanation
format: explainer
summary: "Screen capture is a data donation method that enable researchers to observe what happens on a participant’s screen and learn more about individual experiences on digital platforms and applications. Whether you are…"
status: migrated
legacy:
  - /screen-capture-explainer/
---

Screen capture is a data donation method that enable researchers to observe what happens on a participant’s screen and learn more about individual experiences on digital platforms and applications. Whether you are researching the content of news feeds or how people interact with different types of visual information, screen capture offers an opportunity to investigate how platforms structure content and deliver it based on personal preferences.

It is a powerful method that allows for working with individual participants. It captures the specific content on platforms, including but not limited to TikTok, Facebook, Instagram, and YouTube.

## What does screen capture collect?

Screen capture methods collect the content that appears on a participant’s screen – whether a browser or mobile device – during their normal use of social media or other applications, including advertisements, sponsored content, recommendation feeds, reels, and other content.

Unlike Data Download Packages (see the resources section for more information on DDPS), which provide historical records, screen tracking captures the real-time, personalised experience. The method is particularly valuable for studying ephemeral and sequenced content — material that appears briefly and in a specific order determined by algorithms. This kind of content is invisible to APIs and web scrapers, as it exists only in the personalised feed of individual users.

Screen capture supports **multimodal data (text, image, video)**, can study ephemeral and sequenced content, does not depend on platform APIs, and includes multi-stage enrichment with external databases.

Screen capture can be challenging as it requires participant cooperation and device access, may capture incidental sensitive content, imposes a relatively high participant burden, and carries medium-to-high potential for reactivity bias.

## How does screen capture work?

1. The researcher designs a study, obtains ethics approval, and registers with the AIO system to receive credentials.
2. Participants download and install an application or extension on their device, granting screen recording permissions.
3. The app runs in the background, activating automatically when a target app or site (e.g., Facebook, Instagram, TikTok) is opened, and captures screen recordings as images or video.
4. A pre-trained YOLOv11 machine vision model analyses the images and recordings to identify study-relevant content, while ignoring personal posts and messages. Recordings made outside the target app are automatically discarded.\
5. The captured data is securely transferred to the cloud, where it is processed through a multi-stage pipeline. Additional enrichment may occur via other data sources (eg Meta Ad Library)
6. The participant reviews the processed data and provides explicit consent to share it with the researcher, who then accesses the data through a dashboard with visualisation, annotation, and export capabilities.

## What research does screen capture support?

Screen capture has been used to explore the kinds of gambling and alcohol advertisements young people are exposed to and assess the content of ads during elections. The tools can also be leveraged to understand how misinformation can be visually spread through recommendation algorithms, identify popular trends within online communities, and monitor platforms’ compliance with content-moderation policies.

AIO screen capture technologies are currently being expanded to capture multilingual advertising content, with testing being carried out in Vietnam, Brazil, and South Africa.
