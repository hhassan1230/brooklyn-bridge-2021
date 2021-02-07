/**
 * This sub-module is intended to provide a consistent styling to modals and tooltips across products.
 */
import ModalManager from '../ModalManager';
import { reducers, openModal, closeModal } from '../reducers';
import './styles.less';

export { ModalManager as ui, reducers, openModal, closeModal };
