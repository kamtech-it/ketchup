import { Component, Prop, Event, h, EventEmitter } from '@stencil/core';
import { getCellValueForDisplay } from '../../utils/cell-utils';
import {
    KupManager,
    kupManagerInstance,
} from '../../managers/kup-manager/kup-manager';
import { getDecimalSeparator } from '../../utils/utils';
import {
    KupDataDataset,
    KupDataRow,
} from '../../managers/kup-data/kup-data-declarations';

@Component({
    tag: 'kup-dash-list',
    styleUrl: 'kup-dash-list.scss',
    shadow: true,
})
export class KupDashList {
    @Prop()
    layout = '1';

    @Prop()
    fontsize = '';

    @Prop()
    active = false;

    @Prop()
    columnsNumber: number = 1;

    @Prop()
    fullWidth: boolean = true;

    @Prop()
    horizontal: boolean = false;

    @Prop()
    iconColor: Array<any> = [];

    @Prop()
    valueColor: Array<any> = [];

    @Prop()
    textColor: Array<any> = [];

    @Prop()
    data: KupDataDataset;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    @Event({
        eventName: 'kup-dash-click',
        composed: true,
        cancelable: true,
        bubbles: true,
    })
    dashClick: EventEmitter<{
        idx: number;
    }>;

    render() {
        let rows = [];
        var count = 0;

        this.data.rows.forEach((r: KupDataRow) => {
            let icon = '';
            let unit = '';
            let descr = '';
            let value = '';
            let valueInt = '';
            let valueDec = '';
            let iconColor = {
                color: this.iconColor[count],
            };
            let textColor = {
                color: this.textColor[count],
            };
            let valueColor = {
                color: this.valueColor[count],
            };

            if (this.data.columns[0]) {
                icon = (
                    <div slot="icon">
                        <icon
                            class={r.cells[this.data.columns[0].name].obj.k}
                            style={iconColor}
                        ></icon>
                    </div>
                );
            } else {
                icon = <div slot="icon"></div>;
            }

            if (this.data.columns[1]) {
                unit = (
                    <div slot="unit" style={valueColor}>
                        {r.cells[this.data.columns[1].name].obj.k}{' '}
                    </div>
                );
            } else {
                unit = <div slot="unit"></div>;
            }

            if (this.data.columns[2]) {
                descr = (
                    <div slot="descr" style={textColor}>
                        {r.cells[this.data.columns[2].name].obj.k}
                    </div>
                );
            } else {
                descr = <div slot="descr"></div>;
            }

            if (this.data.columns[3]) {
                let col = this.data.columns[3];
                col.obj = r.cells[this.data.columns[3].name].obj;

                let newValue = getCellValueForDisplay(
                    col,
                    r.cells[this.data.columns[3].name]
                );
                value = (
                    <div slot="value" style={valueColor}>
                        {newValue}
                    </div>
                );
            } else {
                value = <div slot="value"></div>;
            }

            if (this.data.columns[5]) {
                let col = this.data.columns[5];
                col.obj = r.cells[this.data.columns[5].name].obj;

                let newValue = getCellValueForDisplay(
                    col,
                    r.cells[this.data.columns[5].name]
                );
                if (
                    this.data.columns[6] &&
                    r.cells[this.data.columns[6].name].obj.k
                ) {
                    newValue =
                        newValue +
                        getDecimalSeparator(this.kupManager.dates.getLocale());
                }
                valueInt = (
                    <div slot="value-int" style={valueColor}>
                        {newValue}
                    </div>
                );
            } else {
                valueInt = <div slot="value-int"></div>;
            }
            if (this.data.columns[6]) {
                valueDec = (
                    <div slot="value-dec" style={valueColor}>
                        {r.cells[this.data.columns[6].name].obj.k}
                    </div>
                );
            } else {
                valueDec = <div slot="value-dec"></div>;
            }
            const row = (
                <kup-dash
                    layout={this.layout}
                    fontsize={this.fontsize}
                    index={count}
                    active={this.active}
                    slot={String(count)}
                >
                    {icon}
                    {unit}
                    {descr}
                    {value}
                    {valueInt}
                    {valueDec}
                </kup-dash>
            );
            rows.push(row);
            count++;
        });
        return (
            <div>
                <link
                    href="https://cdn.materialdesignicons.com/4.5.95/css/materialdesignicons.min.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <kup-grid
                    columns={this.columnsNumber}
                    singleLine={this.horizontal}
                    class={`${this.fullWidth ? 'kup-full-width' : ''}`}
                >
                    {rows}
                </kup-grid>
            </div>
        );
    }
}
