
# Introduction

Raid arose from the desire to create a predictable state container for the entire app. After a few iterations it has slimmed down considerably, dealing solely with restricting access to the state tree and emitting it when mutations occur.

A major tenet of how Raid should work is that your application is still your own to structure how you like, Raid just exposes mechanisms for accessing and managing changes to that structure to enforce top-down rendering.

Raid tries to **get out of your way** so that you can make decisions on how and when to access and change your data that make sense for your application. Rather than being driven by a framework, Raid should be considered a small library that compliments your application.

Raid makes this possible by holding the application state inside a fold function, the flow of the application then becomes a stream which accepts update events and emits a state tree. All mutations, or updates, have to go through the stream which enforces top-down rendering.

Top-down rendering is perfect for use with [React](https://facebook.github.io/react/) and whilst React is not a hard dependency, Raid was created with it in mind.
