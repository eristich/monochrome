import React, { useRef } from "react";
import { type ControllerRenderProps } from "react-hook-form";

type Props = ControllerRenderProps & {
  onComplete?: (code: string) => void;
  label?: string;
}

const PIN_LENGTH = 5;

const UIInputCode: React.FC<Props> = ({
  value = '',
  name,
  onComplete,
  onChange,
  onBlur,
  label,
  ...props
}) => {
  // Découpe la valeur en tableau de chiffres
  const values = Array(PIN_LENGTH)
    .fill("")
    .map((_, i) => value[i] || "");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Gestion du changement de valeur dans un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, ""); // On garde que les chiffres
    if (!val) {
      updateValue("", idx);
      return;
    }

    // Si un seul chiffre
    updateValue(val[0], idx);
    // Focus sur le suivant
    if (idx < PIN_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  // Gestion du collage (paste) sur un input
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (!pasted) return;
    const chars = pasted.split("");
    const newValues = [...values];
    for (let i = 0; i < chars.length && idx + i < PIN_LENGTH; i++) {
      newValues[idx + i] = chars[i];
    }
    triggerChange(newValues);
    // Focus sur le prochain input vide
    const nextEmpty = newValues.findIndex((v, i) => v === "" && i > idx);
    if (nextEmpty !== -1) {
      inputsRef.current[nextEmpty]?.focus();
    } else {
      inputsRef.current[PIN_LENGTH - 1]?.blur();
    }
    // Callback si tout est rempli
    if (newValues.every((v) => v !== "")) {
      onComplete?.(newValues.join(""));
    }
  };

  // Mise à jour d'une valeur
  const updateValue = (val: string, idx: number) => {
    const newValues = [...values];
    newValues[idx] = val;
    triggerChange(newValues);
    if (newValues.every((v) => v !== "")) {
      onComplete?.(newValues.join(""));
    }
  };

  // Déclenche le onChange du Controller
  const triggerChange = (newValues: string[]) => {
    const code = newValues.join("");
    onChange?.(code);
  };

  // Gestion du backspace pour revenir en arrière
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && values[idx] === "" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  // Gestion du focus pour sélectionner le contenu
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div>
      {label && (
        <label className="text-sm font-normal text-black mb-2 block" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex gap-2 justify-center">
        {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
          <input
            {...props}
            key={idx}
            ref={el => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            className="w-12 h-14 text-center text-2xl border-2 border-black rounded-sm transition-all outline-none duration-200 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.18),0_2px_8px_0_rgba(0,0,0,0.10)]"
            value={values[idx]}
            onChange={e => handleChange(e, idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
            onFocus={handleFocus}
            onPaste={e => handlePaste(e, idx)}
            autoComplete={idx === 0 ? "one-time-code" : "off"}
            name={name}
            onBlur={onBlur}
          />
        ))}
      </div>
    </div>
  );
}

export default UIInputCode;
