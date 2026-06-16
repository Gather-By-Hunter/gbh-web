interface ObjectPositionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const positions = [
  "top left",
  "top center",
  "top right",
  "center left",
  "center center",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right",
];

export const ObjectPositionSelector = ({
  value,
  onChange,
}: ObjectPositionSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-48">
      {positions.map((position) => (
        <button
          key={position}
          type="button"
          onClick={() => onChange(position)}
          className={`h-12 border rounded-md transition-all ${
            value === position
              ? "bg-gbh-green border-gbh-green shadow-inner"
              : "bg-gbh-white hover:bg-gbh-cream border-gbh-gold/30"
          }`}
          title={position}
        >
          <div
            className={`w-2 h-2 mx-auto rounded-full ${
              value === position ? "bg-gbh-white" : "bg-gbh-gold"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
