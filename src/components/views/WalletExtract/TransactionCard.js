import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Icon } from '@components/widgets';
import { colors, measures } from '@common/styles';
import { Wallet as WalletUtils } from '@common/utils';

@inject('prices')
@observer
export default class TransactionCard extends React.Component {

    get isReceiving() {
        return this.to.toLowerCase() === this.props.walletAddress.toLowerCase();
    }

    get isConfirmed() {
        return this.props.transaction.confirmations > 0;
    }

    get from() {
        return this.props.transaction.from;
    }

    get to() {
        return this.props.transaction.to;
    }

    get iconName() {
        return (this.isReceiving) ? 'download' : 'upload';
    }

    get balance() {
        return Number(WalletUtils.formatBalance(this.props.transaction.value));
    }
    
    get fiatBalance() {
        return Number(this.props.prices.usd * this.balance).toFixed(2);
    }

    get timestamp() {
        const { timeStamp } = this.props.transaction;
        const timestamp = Number(timeStamp) * 1000;
        const date = new Date(timestamp);
        return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    renderTransactionOperator = () => (
        <Text
            style={styles.operatorLabel}
            ellipsizeMode="tail"
            numberOfLines={1}
            children={this.isReceiving ? `From ${this.from}` : `To ${this.to}`} />
    );

    renderConfirmationStatus() {
        return this.isConfirmed ?
            <Icon name="checkmark" color={colors.success} /> :
            <Icon name="clock" type="ei" color={colors.pending} />
    }

    render() {
        const { transaction } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    <Icon name={this.iconName} type="fe" />
                </View>
                <View style={styles.centerColumn}>
                    {this.renderTransactionOperator()}
                    <Text>{this.timestamp}</Text>
                </View>
                <View style={styles.rightColumn}>
                    <View style={styles.amountContainer}>
                        <Text
                            style={styles.amountLabel}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            children={this.balance.toFixed(4)} />
                        <Text style={styles.fiatLabel}>US$ {this.fiatBalance}</Text>
                    </View>
                    <View style={styles.confirmationsContainer}>
                        {this.renderConfirmationStatus()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: colors.secondary,
        height: 80,
        marginBottom: measures.defaultMargin,
    },
    leftColumn: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },
    centerColumn: {
        flex: 1,
        height: 80,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    operatorLabel: {
        fontWeight: 'bold',
        fontSize: measures.fontSizeMedium
    },
    rightColumn: {
        paddingHorizontal: measures.defaultPadding,
        width: 120,
        flexDirection: 'row',
    },
    amountContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    confirmationsContainer: {
        marginLeft: measures.defaultMargin,
        alignItems: 'center',
        justifyContent: 'center',
        width: 20
    },
    amountLabel: {
        fontWeight: 'bold',
        fontSize: measures.fontSizeMedium
    },
    fiatLabel: {
        fontSize: measures.fontSizeMedium - 4
    }
});