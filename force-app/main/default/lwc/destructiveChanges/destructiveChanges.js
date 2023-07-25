import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class DestructiveChanges extends LightningModal {
    @api content;
}