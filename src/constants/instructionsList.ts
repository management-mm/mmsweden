import { IconId } from '@enums/iconsSpriteId';

export interface IInstructionsItem {
  iconId: keyof typeof IconId;
  iconSize: { width: number; height: number };
  title: string;
  desc: string;
}

const instructionsList: IInstructionsItem[] = [
  {
    iconId: 'Document',
    iconSize: { width: 41, height: 48 },
    title: 'Instructions.Step1Title',
    desc: 'Instructions.Step1Desc',
  },
  {
    iconId: 'Specialist',
    iconSize: { width: 48, height: 48 },
    title: 'Instructions.Step2Title',
    desc: 'Instructions.Step2Desc',
  },
  {
    iconId: 'Endorsment',
    iconSize: { width: 51, height: 48 },
    title: 'Instructions.Step3Title',
    desc: 'Instructions.Step3Desc',
  },
];

export default instructionsList;
