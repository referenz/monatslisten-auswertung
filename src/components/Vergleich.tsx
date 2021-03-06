import { MutableRefObject, useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Projektliste from './Tabelle_Projektliste';
import Monatsbericht from '../Monatsbericht';
import FileBufferObj from '../types/FileBufferObj';

function Vergleich(props: {
    datei_alt: MutableRefObject<FileBufferObj>;
    monatsbericht: MutableRefObject<Monatsbericht>;
    className?: string;
}) {
    const monatsbericht_alt = useRef<Monatsbericht>(null);
    const [abweichung_foerder, setAbweichung_foerder] = useState<[string, Map<string, string[]>][]>(null);
    const [abweichung_projektzahl, setAbweichung_projektzahl] = useState(null);
    const [abweichung_bezeichnung, setAbweichung_bezeichnung] = useState(null);

    useEffect(() => {
        monatsbericht_alt.current = Monatsbericht.fromArrayBuffer(
            props.datei_alt.current.name,
            props.datei_alt.current.buffer
        );
    }, [props.datei_alt]);

    useEffect(() => {
        setAbweichung_foerder(
            Array.from(
                props.monatsbericht.current.abweichung_projektdaten(monatsbericht_alt.current, 'Zuwendungen', {
                    ordered: true,
                }) as Map<string, Map<string, string[]>>
            )
        );

        setAbweichung_bezeichnung(
            Array.from(
                props.monatsbericht.current.abweichung_projektdaten(monatsbericht_alt.current, 'Bezeichnungen', {
                    ordered: true,
                }) as Map<string, Map<string, string[]>>
            )
        );

        setAbweichung_projektzahl(
            props.monatsbericht.current.abweichung_projektzahl(monatsbericht_alt.current, { ordered: true })
        );
    }, [monatsbericht_alt, props.monatsbericht]);

    return (
        <Container className={props.className + ' vergleich'}>
            {abweichung_foerder && abweichung_foerder.length > 0 && (
                <Projektliste
                    mode="Vergleich_Zuwendung"
                    abweichende_daten={abweichung_foerder}
                    monatsbericht={props.monatsbericht.current}
                    monatsbericht_alt={monatsbericht_alt.current}
                    tabellen_headline_h2={true}
                >
                    Abweichende F??rdersummen
                </Projektliste>
            )}
            {abweichung_foerder && abweichung_foerder.length === 0 && <p>Keine abweichenden F??rdersummen</p>}

            {abweichung_bezeichnung && abweichung_bezeichnung.length > 0 && (
                <Projektliste
                    mode="Vergleich_Bezeichnung"
                    abweichende_daten={abweichung_bezeichnung}
                    monatsbericht={props.monatsbericht.current}
                    monatsbericht_alt={monatsbericht_alt.current}
                    tabellen_headline_h2={true}
                >
                    Abweichende Bezeichung von Tr??gername oder Projekttitel
                </Projektliste>
            )}
            {abweichung_bezeichnung && abweichung_bezeichnung.length === 0 && (
                <p>Keine Ver??nderungen bei Tr??gernamen oder Projekttiteln</p>
            )}

            {abweichung_projektzahl && (abweichung_projektzahl[0].size > 0 || abweichung_projektzahl[1].size > 0) && (
                <>
                    <h2 className="mt-5">Hinzugekommene oder entfernte Projekte*</h2>
                    <p className="text-muted small">
                        * Die Angaben zur Bewilligungszeit und Gesamtf??rderzeit und werden derzeit noch nicht
                        ausgewertet
                    </p>
                    {abweichung_projektzahl[0].size > 0 && (
                        <Projektliste
                            monatsbericht={props.monatsbericht.current}
                            projekte={Array.from(abweichung_projektzahl[0])}
                        >
                            Hinzugekommene Projekte
                        </Projektliste>
                    )}

                    {abweichung_projektzahl[1].size > 0 && (
                        <Projektliste
                            monatsbericht={monatsbericht_alt.current}
                            projekte={Array.from(abweichung_projektzahl[1])}
                        >
                            Weggefallene Projekte
                        </Projektliste>
                    )}
                </>
            )}
            {abweichung_projektzahl && abweichung_projektzahl[0].size === 0 && abweichung_projektzahl[1].size === 0 && (
                <p>Keine hinzugekommenen oder entfernten Projekte</p>
            )}
        </Container>
    );
}

export default Vergleich;
