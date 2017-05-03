# Instant Photo Procesing System

A cél egy olyan azonnali fotófeldolgozó rendszer létrehozása volt, melynek részeit egy Digitális Tükörreflexes fényképezőgép, egy Toshiba FlashAir SD kártya, és egy okostelefonos alkalmazás képezi. Az alkalmazás lehetőséget ad arra, hogy az fényképezőgéppel készített kép azonnal, vezeték nélküli kapcsolaton megjelenjen az alkalmazásban, és innen a felhasználó azonnal megoszthassa különböző felületeken.

## SD kártya API
Az API alábbi részeit használjuk az alkalmazásban.
### Command.cgi
A http://SDIPCÍM/command.cgi?op=100&DIR=/DCIM paranccsal kilistázhatjuk a „DCIM” nevű mappa tartalmát. A következő, vesszővel tagolt formátumban adja meg az adott könyvtárban lévő fájlokat.
LANSD_FILELIST
/DCIM,100WLAN0,w,xx,yyyyy,zzzzz
/DCIM,MISC,w,xx,yyyyy,zzzzz
Ha vesszők szerint felbontjuk e kódot, az első elem az aktuális mappa elérési útvonalát adja meg. A második elem az adott fájl nevét. A „w” betű az adott fájl méretét adja meg bájtban, az xx az attribútumait, az yyyyy a létrehozási dátumot, a zzzzz pedig az időt adja meg, decimális formában. A betűvel jelölt értékeket nem használja fel az alkalmazás.
Az op értékét változtatva más információkat is lekérdezhetünk, például az op=101 csupán a fájlok számát adja vissza, az op=104 a beállított SSID értéket, stb. Ezen opciók a jelen projektben nincsenek használva. 
Részletes dokumentáció:
https://flashair-developers.com/en/documents/api/commandcgi/

### thumbnail.cgi
Kisméretű, vezetéknélküli kapcsolaton gyorsabban átvihető méretben adja vissza az adott állományt. A „Távoli könyvtár” nézetben, ahol a kártyán lévő összes képet meg kell jeleníteni, az alkalmazás e parancs segítségével kérdezi le a nagyméretű képek kisméretű változatát.
A Például:
http://flashair/thumbnail.cgi?/DCIM/100__TSB/DSC_100.JPG
