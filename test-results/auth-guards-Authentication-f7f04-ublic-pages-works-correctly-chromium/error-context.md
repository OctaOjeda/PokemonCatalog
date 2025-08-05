# Page snapshot

```yaml
- navigation:
  - img "Pokemon Logo"
  - text: PokéApp
  - link "Home":
    - /url: /
  - link "Pokemon Catalog":
    - /url: /pokemon-catalog
  - link "Pokemon List":
    - /url: /pokemons
  - button "Logout"
  - link "Register":
    - /url: /register
- main:
  - heading "Login" [level=2]
  - text: Email/Username
  - textbox "Email/Username"
  - text: Password
  - textbox "Password"
  - button "Login"
  - paragraph:
    - text: Don't have account?
    - link "Register":
      - /url: /register
- contentinfo:
  - heading "Information" [level=3]
  - paragraph: Pokémon is a franchise that includes video games, animated series, movies, trading cards, and much more. It was created by Satoshi Tajiri and launched by Nintendo in 1996. The main goal is to catch, train, and battle creatures called Pokémon.
  - heading "History" [level=3]
  - paragraph: The Pokémon adventure begins in the Kanto region, where young trainers start their journey to become Pokémon masters. Over the years, the saga has grown and evolved, capturing the imagination of millions worldwide.
  - text: © 2025 PokéApp. All rights reserved.
```