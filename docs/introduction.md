
# Introduction

Raid arose from the desire to create a predictable state container for the entire app. Initially created as a means of saving the entire state of an application Raid now successfully makes life easier for developers by creating immutable application state which is predicable, replicable and reliable.

A major tenet of how Raid should work is that your application is still your own to structure how you like, Raid just exposes mechanisms for accessing and managing changes to that structure to enforce top-down rendering.

Raid tries to **get out of your way** so that you can make decisions on how and when to access and change your data that make sense for your application. Rather than being driven by a framework, Raid should be considered a small library that compliments your application.

Raid makes this possible by allowing components to hook into only the specific parts of the state tree that corresponds to them via **cursors**. Each change to the state triggers an `update` event which can then be used to render the entire state of your application. This top-down rendering is perfect for use with [React](https://facebook.github.io/react/) and whilst React is not a hard dependency, Raid was created with it in mind.
