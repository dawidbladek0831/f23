# Presence System

## Table of Contents
* [General Info](#general-information)
* [Documentation](#documentation)
* [Services](#services)
* [Technologies Used](#technologies-used)
* [References & Inspirations](#references-&-inspirations)

## General Information
The Presence System is a microservice designed to manage user presence data, including their online status, and custom statuses.
Its core components include HTTP endpoints for heartbeats, status management, group management, and a real-time publisher component utilizing Server-Sent Events (SSE).

## Documentation
Complete documentation is available in the [.doc folder](./.doc/doc.md).

## Services
System is composed of one services:
- Presence - [Github](https://github.com/dawidbladek0831/f23-presence)

## Technologies Used
- Spring
- Keycloak

## References & Inspirations
The following materials provided inspiration during the design of the system. They include both examples of architectural solutions and discussions of approaches to problems similar to those that the Presence system solves.

- [1] https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-live-comments, 6.10.2025
- [2] https://systemdesign.one/real-time-presence-platform-system-design, 6.10.2025
- [3] https://systemdesign.one/live-comment-system-design, 6.10.2025
- [4] Alex XU, System design interview, 2020
