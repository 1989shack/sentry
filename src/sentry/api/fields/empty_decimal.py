from rest_framework import serializers
from rest_framework.fields import empty


class EmptyDecimalField(serializers.DecimalField):
    """
    DRF used to translate a blank field as a null decimal, but after 3.x it
    doesn't accept an empty string as a value. We rely on this behaviour in some
    cases, so this restores it.
    """

    def to_internal_value(self, data):
        return None if data == "" else super().to_internal_value(data)

    def run_validation(self, data=empty):
        return None if data == "" else super().run_validation(data)
