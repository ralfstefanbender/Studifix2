# Bank-Beispiel
Herzlich willkommen!

## Einleitung
Dies ist die Realisierung des Bank-Beispiels für das Software-Praktikum des Studiengangs 
*WI7* ab Sommersemester 2020. Es stellt die dritte Inkarnation des seit 2003 im Studiengang
und dessen Vorgängerstudiengang gepflegten Bank-Beispiel dar. Beide Vorgängerversionen
waren nahezu vollständige Java-Implementation. Standen anfangs noch dedizierte Clients im 
Vordergrund, so wurde im Sommer 2013 dann mit Google Web Toolkit (GWT) der Fokus auf 
Web-Applikationen ausgerichtet. Doch auch GWT kam "in die Jahre" und so wurde bereits 2017 
eine künftige Neuausrichtung beschlossen, die den technologischen Entwicklungen in der
Praxis Rechnung tragen sollte.

Es gibt eine schier unüberschaubare Zahl an technischen Möglichkeiten, Web-Applikationen
zu realisieren. Ganz gleich, welche Auswahl an Techniken man trifft, es wird stets 
Gegenargumente und Argumente für Alternativen geben. Wir mussten also (wieder) im 
Spannungsfeld Grad der Verbreitung in der Praxis, Zukunftsfähigkeit, zu erwartende Lernkurve,
didaktische Eignung, absehbare Probleme der Stud. mit den ausgewählten Techniken, 
Integration mit den Grundlagenvorlesung im Studiengang u.v.a.m. 
eine Entscheidung treffen.

Das Bank-Beispiel setzt auf einen modernen GUI-Ansatz auf Basis von React, mySQL als 
Datenbank-Management-System, einem Python-Backend mit REST-Schnittstelle sowie dessen 
Deployment auf die Google-Infrastruktur in der Cloud.

Natürlich gäbe es zahlreiche Alternativen, die wir auch im Auge behalten werden.
Wir sind sicher, unseren Studierenden mit diesem "Technologie-Stack" für die Praxis 
relevante Kenntnisse vermitteln zu können und hoffen, dass Sie sich in diesem Projekt gut
"zurecht finden" werden.

## Inhalt
Wir haben zu Ihrer Unterstützung einige Markdown-Dokumente angelegt, die weitere Informationen
enthalten.
- [INSTALLATION.md](INSTALLATION.md) informiert Sie, welche Vorkehrungen Sie treffen müssen, 
um das Beispiel einzurichten, damit es auf Ihrem Entwicklungsrechner lauffähig wird.
- [RUN.md](RUN.md) baut auf [INSTALLATION.md](INSTALLATION.md) auf und erklärt den Start des
Beispiels (DB, Backend und schließlich Frontend).
-[ResourceNaming.md](ResourceNaming.md) dokumentiert sämtliche REST-Service-Ressourcen des
Backend.
- [Links.md](Links.md) ist eine Zusammenstellung von Links auf in diesem Projekt verwendete
oder anderweitig relevante APIs, Frameworks, Dokumentationen etc.
- [LICENSE.md](LICENSE.md) gibt lizenzrechtliche Hinweise.
- [/src](/src): In diesem Verzeichnis finden Sie den Source Code des Projekts.
- [/frontend](/frontend): In diesem Verzeichnis finden Sie separat vom restlichen Source Code 
den Source Code des Frontend.
- [/mysql](/mysql): Hier finden Sie mySQL-spezifisches Material wie z.B. den Dump, um eine
Beispieldatenbank herzustellen.
- [/postman](/postman): Dieses Verzeichnis beinhalten Exports von Beispiel-Requests für das
Backend, die mit dem Programm [*Postman*](https://www.postman.com) erstellt worden sind.
*Hinweis:* Möglichweise entfernen wir dieses Verzeichnis in künftigen Versionen, da es für Sie
nicht unbedingt erforderlich ist.

