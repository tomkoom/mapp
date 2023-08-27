import { FC } from "react";
import styled from "styled-components";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// state
import { useAppDispatch } from "../../hooks/useRedux";
import { setMapPosition } from "../../state/map";

interface AutocompleteInputProps {
  mapIsLoaded: boolean;
}

const AutocompleteInput: FC<AutocompleteInputProps> = ({
  mapIsLoaded,
}): JSX.Element => {
  if (!mapIsLoaded) return <p>map is not loaded</p>;
  const dispatch = useAppDispatch();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    // get lat, lng
    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);
    dispatch(setMapPosition({ lat, lng }));
  };

  return (
    <AutocompleteInputStyled>
      <Input>
        <input
          type="text"
          placeholder="Search place"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
        />
      </Input>

      <Options>
        {status === "OK" &&
          data.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item.description)}
            >
              {item.description}
            </li>
          ))}
      </Options>
    </AutocompleteInputStyled>
  );
};

const AutocompleteInputStyled = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  > input {
    height: 2.25rem;
    width: 100%;
    font-size: var(--fsText);
    padding: 0 0.75rem;
    box-sizing: border-box;
  }
`;

const Options = styled.ul`
  width: 100%;
  position: absolute;
  top: 2.5rem;
  left: 0px;
  font-size: var(--fsText);
  line-height: 110%;
  box-shadow: var(--shadow);
  z-index: 1;

  > li {
    display: flex;
    align-items: center;
    height: 2.5rem;
    width: 100%;
    background-color: var(--background);
    padding: 0 0.75rem;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      background-color: var(--underlay1);
    }
  }
`;

export default AutocompleteInput;
