package serializer;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;

import org.joda.money.CurrencyUnit;
import org.joda.money.Money;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class MoneySerializer extends JsonSerializer<String> {
    @Override
    public void serialize(String value, JsonGenerator jgen, SerializerProvider provider) throws IOException,
            JsonProcessingException {
        // put your desired money style here
    	// Create a DecimalFormat that fits your requirements
    	DecimalFormatSymbols symbols = new DecimalFormatSymbols();
    	symbols.setGroupingSeparator(',');
    	symbols.setDecimalSeparator('.');
    	String pattern = "#,##0.0#";
    	DecimalFormat decimalFormat = new DecimalFormat(pattern, symbols);
    	decimalFormat.setParseBigDecimal(true);
    	BigDecimal bd;
		try {
			bd = (BigDecimal) decimalFormat.parse(value);
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
    	
    	Money money = Money.of(CurrencyUnit.USD, bd, RoundingMode.HALF_UP);
        jgen.writeNumber(money.getAmount());
    }
}
