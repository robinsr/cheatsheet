## cheatsheet todos



* [x] Suggest new app button (when active app not recognized)
* [x] auto-switch applications ("active follow")
* [x] Add help window
* [x] support multi-action (aka second keystroke)
* [x] Key handling. Ideally should not need to use a mouse at all. Basics include:
* [x] Option to keep window on top with `win.alwaysOnTop`
* [x] On search, with no results, ~~show button~~ press enter to create new

### Functionality

* Import keybinding files from web
* Export app keybinding. Determine export format (yaml, json, markdown?)
* **support AND/OR/THEN** (see appendix)
* Favorite shortcuts
* add icon to shortcuts
* Drag shortcut from one category to another
* Keyboard shortcuts for Cheatsheet itself
  * N - new shortcut
  * ~~S/L - focus search bar~~
  * ~~E - edit item~~
  * F - favorite
  * ~~? - help window~~
  * ~~T - toggle theme~~
  * ~~ArrowUp ArrowDown navigation~~
* "/" commands ("slash commands") (see slack for inspiration: https://bit.ly/3y1hkMF)
* "condensed" or "clean" view (hide UI elements)
* Profiles for apps (text editors and IDEs can have multiple keymaps (default))

### Style

* [x] Match desktop theme with `nativeTheme`. Kinda done but with media queries (functionally equivalent)
* App icon

## Bugs

* Scroll bars; set some minimums. Modals have scroll bars too (bad)
* Shortcuts with "+" character cause rendering error because "+" is used as key separator
  * Since some symbols are not used in shortucts (any alt or shift symbol), can therefor be safely used
    as separator? Examples `":", "|", "+"` ("+" is the obvious one) ✅
* Card title, text overflows (probably other text overflows, shortcut, app list, etc)

## Appendix

Alternate key ideas:

```
  [ Cmd+Alt+LeftArrow ] OR [ Cmd+Alt+RightArrow ]`
  or
  [ Cmd+Alt+LeftArrow|RightArrow ] ✅
```

Profiles:

```js
{ 
  actions: [
    { 
        id, app, category, etc
        keyBindings: [
          { profile: 'default', strokes: [ "Cmd-K", "Cmd-M"] },
          { profile: 'southpaw', strokes: [ "Cmd-Shift-M" ] }
        ]
    }
  ]
}
```