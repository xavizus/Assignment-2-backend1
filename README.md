Ni ska bygga en applikation för att betygsätta/recensera restauranger

Ni får samarbeta med att sätta upp en startuppsättning med restauranger om ni vill. Ni kan även samarbeta med design/skisser (sätta upp wireframes) om ni vill. Ni får använda frameworks (typ bootstrap, angular el liknande).

- Applikationen ska använda MySQL.
- All CRUD-funktionalitet ska ske genom API:er

# G-krav

- [x] Vilken användare som helst ska kunna CRUD:a restauranger med ett gränssnitt.
    -   Enbart admin kan CRUDA:a restauranger
- [x] Användare ska kunna skriva recensioner om restaurangerna
    -   Endast inloggade användare kan skriva recensioner och sätta rating.
- [x] Användare ska betygsätta restaurangerna i recensionen på en skala 1-5 (betyget är alltså required)
    - Användare måste sätta dit rating (stjänor 1-5).
- [x] Användare måste logga in för att skriva recensioner. Välj mellan JWT eller Passport.
    - Identifiering sker med JWT.
- [x] Applikationen ska publiceras på heroku eller något liknande.
    - Postad på min egna server.

# VG-krav

- [x] Enbart admin kan CRUD:a restauranger
    - Enbart admins kan CRUD:a restauranger
- [x] Kontrollera indata mot skadlig kod
    - All SQL kod är escapat samt HTML-koden är skyddad mot CORS.
- [x] Aggregerade funktioner
    - Jag är faktiskt stolt över min lösning på aggregerande funktioner för top 10, geners och när alla restauranger visas.
- På förstasidan ska ni visa:
    - [x]  de tio bästa restaurangerna genom snittbetyg
    - [x]  genres av restauranger (pizzeria, vegetariskt osv)

# Gränsfallsfeatures

- [x] Användarvänligt, användbart, presentabelt, responsivt
- [x] Betygsätta genom att klicka på stjärna, typ: ***** <- klicka på en av stjärnorna

Redovisning kommer att ske muntligt torsdag den 9 januari, bokningsschema kommer att komma upp senare. Ni ska även ladda upp en zip-fil med era projekt här.
