import React, { Dispatch, FC, SetStateAction } from "react";
import styled from "styled-components";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface AutocompleteInputProps {
  setSelected: Dispatch<SetStateAction<google.maps.LatLngLiteral>>;
}

const AutocompleteInput: FC<AutocompleteInputProps> = ({
  setSelected,
}): JSX.Element => {
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
    setSelected({ lat, lng });
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="search place"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
      />
      {status === "OK" &&
        data.map((item) => (
          <div
            key={item.place_id}
            onClick={() => handleSelect(item.description)}
          >
            {item.description}
          </div>
        ))}
    </div>
  );
};

const Input = styled.input`
  background-color: var(--underlay1);
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
`;

export default AutocompleteInput;
