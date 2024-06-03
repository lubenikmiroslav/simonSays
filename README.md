
# Hra Simon Says

Tento projekt je jednoduchá implementace klasické hry "Simon Says". Hra generuje sekvenci barev a hráč musí tuto sekvenci správně zopakovat. Hra se postupně stává obtížnější, jak se sekvence prodlužuje. Na konci hry se hráčovo skóre uloží do žebříčku.

## Požadavky

- Node.js (doporučeno v14 nebo vyšší)
- npm (Node Package Manager)

## Instalace

1. Naklonujte repozitář:

    ```sh
    git clone https://github.com/yourusername/simon-says-game.git
    ```

2. Přejděte do adresáře projektu:

    ```sh
    cd simon-says-game
    ```

3. Nainstalujte závislosti:

    ```sh
    npm install
    ```

## Spuštění serveru

Server spustíte následujícím příkazem:

```sh
node server.js
Server poběží na http://localhost:3000.

Nastavení frontendu:
    Otevřete index.html ve vašem webovém prohlížeči.

Hraní hry:
    Klikněte na tlačítko "Start" pro zahájení hry.
    Sledujte sekvenci barev, které se rozsvítí.
    Zopakujte sekvenci kliknutím na barevná tlačítka.
    Pokud správně zopakujete sekvenci, hra přejde do dalšího kola s delší sekvencí.
    Pokud uděláte chybu, hra skončí a vaše skóre se uloží do žebříčku.

Žebříček:
    Žebříček zobrazuje nejlepší skóre z předchozích her. Skóre jsou uložena na serveru a načítají se při načtení hry.